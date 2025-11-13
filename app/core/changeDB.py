from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.expression import asc, desc
from .models import Activity, Route, UserRoutes
from app.auth.models import User
from typing import Sequence, Tuple
from sqlalchemy import Row, Result, Select, func
from app import db
from sqlalchemy import desc


def remove_activity(activity: Activity):
    db.session.delete(activity)
    db.session.commit()

