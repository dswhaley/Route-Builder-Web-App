from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.expression import asc, desc
from .models import Activity, Route, UserRoutes
from app.auth.models import User
from typing import Sequence, Tuple
from sqlalchemy import Row, Result, Select, func
from app import db
from sqlalchemy import desc, func
from app.core.models import Type

def get_activity_by_id(aid):
    query: Select[Tuple[Activity]] = (
        db.select(Activity)
        .where(Activity.aid == aid)
        )
    rows = db.session.execute(query).all()
    return rows[0][0]

def get_activities_by_date():
    query: Select[Tuple[Activity]] = (
        db.select(Activity)
        .order_by(desc(Activity.start_time))
        )
    rows: Sequence[Row[Tuple[Activity]]] = db.session.execute(query).all()
    activities: list[Activity] = [row[0] for row in rows]

    return activities

def get_user_activity(id):
    query: Select[Tuple[Activity]] = db.select(Activity).where(Activity.aid == id)
    rows: Sequence[Row[Tuple[Activity]]] = db.session.execute(query).all()
    activities: list[Activity] = [row[0] for row in rows]

    return activities

def get_users_routes(id):
    query: Select[Tuple[Route]] = (
        db.select(Route)
        .join(UserRoutes, Route.rid == UserRoutes.rid)
        .where(UserRoutes.uid == id)
        .distinct()
        )
    rows: Sequence[Row[Tuple[Route]]] = db.session.execute(query).all()
    routes: list[Route] = [row[0] for row in rows]

    return routes


def get_user_total_miles_given_activity(user_id, type: Type):
    query = (
        db.select(func.sum(Activity.distance))      
        .where(Activity.user_id == user_id)
        .where(Activity.type == type)
    )
    row = db.session.execute(query).all()
    row = row[0][0]
    if row is None:
        row = 0
    return row


def get_route(id):
    query: Select[Tuple[Route]] = db.select(Route).where(Route.rid == id)
    row: Sequence[Row[Tuple[Route]]] = db.session.execute(query).all()
    return row[0][0]

def get_user(id):
    query: Select[Tuple[User]] = db.select(User).where(User.id == id)
    row: Sequence[Row[Tuple[User]]] = db.session.execute(query).all()
    return row[0][0]

