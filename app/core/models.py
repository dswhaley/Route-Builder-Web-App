from enum import Enum
from typing import Any, Sequence, Tuple, List
from datetime import date, datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from marshmallow_sqlalchemy.fields import Nested

from app import db, ma
from app.auth.models import User, UserSchema

################################################################################
# Core Database Model Classes
################################################################################

# define Model for Banks table
from enum import Enum

class Type(Enum):
    RUN = "Run"
    RIDE = "Ride"

class Activity(db.Model):
    __tablename__ = 'Activity'
    aid:                Mapped[int] = mapped_column(primary_key=True)
    user_id:            Mapped[int] = mapped_column(db.ForeignKey('User.uid'), nullable=False)
    route_id:           Mapped[int] = mapped_column(db.ForeignKey('Route.rid'), nullable=True)
    title:              Mapped[str] = mapped_column(nullable=False)
    description:        Mapped[str] = mapped_column(nullable=True)
    start_time:         Mapped[datetime] = mapped_column(nullable=False)
    type:               Mapped[Type] = mapped_column(nullable=False)
    duration_seconds:   Mapped[int] = mapped_column(nullable=False)
    user:               Mapped['User'] = relationship()
    route:               Mapped['Route'] = relationship()


class Route(db.Model):
    __tablename__ = 'Route'
    rid: Mapped[int] = mapped_column(primary_key=True)
    distance: Mapped[float] = mapped_column(nullable=False)
    elevation: Mapped[float] = mapped_column(nullable=False)
    route_name: Mapped[str] = mapped_column(nullable=False)

    #Storing images in a database is not a good idea as they take up a lot of space.
    #Instead image_name stores the id of the route, and the image will be saved in route_images.
    #That way when the image is needed it can be fetched from that directory by that name. 
    image_name: Mapped[str] = mapped_column(nullable=False)

class UserRoutes(db.Model):
    __tablename__ = "UserRoutes"
    urid: Mapped[int] = mapped_column(primary_key=True)
    rid: Mapped[int] = mapped_column(db.ForeignKey('Route.rid'))
    uid: Mapped[int] = mapped_column(db.ForeignKey('User.uid'))

################################################################################
# JSON Schemas for Core Database Models
################################################################################

# TODO: define accompanying Marshmallow JSON schemas here to support REST API

################################################################################
# Utility Functions for Basic Database Tasks
################################################################################

def init_app_db():
    """Initialize database tables and add any default entries"""
    # completely drop all tables and re-create them from schemas
    db.drop_all()
    db.create_all()
    # create a testing account at app launch
    example_user = User(
        email="huckfinn@example.com",               # type: ignore[call-arg]
        password_hash='reallygoodpassword',         # type: ignore[call-arg]
        dob=date(2004, 12, 16),                     # type: ignore[call-arg]
        admin=False,                                # type: ignore[call-arg]
        username="huckfinn")                        # type: ignore[call-arg]
    db.session.add(example_user)                
    db.session.commit()

    user = User.query.filter_by(email="huckfinn@example.com").first()

    if user:
        print("✅ User found:", user.username)
    else:
        print("❌ No user with that email.")