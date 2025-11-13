from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.expression import asc, desc
from models import Activity, User, Route, UserRoutes
from typing import Sequence, Tuple
from sqlalchemy import Row, Result, Select, func
from app import db


def get_all_activities():
    query: Select[Tuple[Activity]] = db.select(Activity)
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

def get_route(id):
    query: Select[Tuple[Route]] = db.select(Route).where(Route.rid == id)
    row: Sequence[Row[Tuple[Route]]] = db.session.execute(query).all()
    return row[0]

def get_user(id):
    query: Select[Tuple[User]] = db.select(User).where(User.uid == id)
    row: Sequence[Row[Tuple[User]]] = db.session.execute(query).all()
    return row[0]

