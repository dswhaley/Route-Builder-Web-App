from enum import Enum
from typing import Any, Sequence, Tuple, List
from datetime import date, datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship

from marshmallow_sqlalchemy.fields import Nested
from marshmallow_sqlalchemy import SQLAlchemySchema, SQLAlchemyAutoSchema, auto_field
from marshmallow import fields as ma_fields


from marshmallow_sqlalchemy import fields as ma_sql_fields
from app.auth.models import User, UserSchema
from app import db

############################### #################################################
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
    user_id:            Mapped[int] = mapped_column(db.ForeignKey('Users.id'), nullable=False)
    route_id:           Mapped[int] = mapped_column(db.ForeignKey('Route.rid'), nullable=True)
    title:              Mapped[str] = mapped_column(nullable=False)
    description:        Mapped[str] = mapped_column(nullable=True)
    start_time:         Mapped[datetime] = mapped_column(nullable=False)
    type:               Mapped[Type] = mapped_column(nullable=False)
    distance:           Mapped[float] = mapped_column(nullable=False)
    duration_minute:   Mapped[int] = mapped_column(nullable=False)
    user:               Mapped['User'] = relationship()
    route:               Mapped['Route'] = relationship()


class Route(db.Model):
    __tablename__ = 'Route'
    rid: Mapped[int] = mapped_column(primary_key=True)
    distance: Mapped[float] = mapped_column(nullable=False)
    elevation: Mapped[float] = mapped_column(nullable=False)
    route_name: Mapped[str] = mapped_column(nullable=False)
    coord_string: Mapped[str] = mapped_column(nullable=False)
    #Storing images in a database is not a good idea as they take up a lot of space.
    #Instead image_name stores the id of the route, and the image will be saved in route_images.
    #That way when the image is needed it can be fetched from that directory by that name.
    image_name: Mapped[str] = mapped_column(nullable=False)

class UserRoutes(db.Model):
    __tablename__ = "UserRoutes"
    urid: Mapped[int] = mapped_column(primary_key=True)
    rid: Mapped[int] = mapped_column(db.ForeignKey('Route.rid'))
    uid: Mapped[int] = mapped_column(db.ForeignKey('Users.id'))

################################################################################
# JSON Schemas for Core Database Models
################################################################################

# TODO: define accompanying Marshmallow JSON schemas here to support REST API

################################################################################
# Utility Functions for Basic Database Tasks
################################################################################

def init_app_db():
    # db.drop_all()
    # db.create_all()

    # --- USERS ---
    users = [
        User(email="test1@example.com", username="user1", dob=date(2001, 1, 1), admin=False), # type: ignore[call-arg]
        User(email="test2@example.com", username="user2", dob=date(2002, 2, 2), admin=False), # type: ignore[call-arg]
        User(email="test3@example.com", username="user3", dob=date(2003, 3, 3), admin=True), # type: ignore[call-arg]
    ] 
    users[0].password = "password"
    users[1].password = "password"
    users[2].password = "password"

    # db.session.add_all(users)
    # db.session.commit()

    # --- ROUTES ---
    routes = [
        Route(route_name="Route 1", distance=5.0, elevation=10, coord_string = "", image_name="1.png"),   # type: ignore[call-arg]
        Route(route_name="Route 2", distance=10.0, elevation=50, coord_string = "", image_name="2.png"),  # type: ignore[call-arg]
        Route(route_name="Route 3", distance=15.0, elevation=100, coord_string = "", image_name="3.png"), # type: ignore[call-arg]
    ]
    # db.session.add_all(routes)
    # db.session.commit()

    # --- ACTIVITIES ---
    activities = [
        Activity(user_id=1, route_id=1, distance=15.1, title="Run 1", description="test run", # type: ignore[call-arg]
                 start_time=datetime(2025, 11, 10, 8, 0),  type=Type.RUN, duration_minute=30), # type: ignore[call-arg]
        Activity(user_id=2, route_id=2, title="Ride 1", distance=20, description="just testing", # type: ignore[call-arg]
                 start_time=datetime(2025, 11, 11, 9, 0), type=Type.RIDE, duration_minute=45), # type: ignore[call-arg]
        Activity(user_id=3, route_id=3, title="Run 2", distance=13.1, description="another test", # type: ignore[call-arg]
                 start_time=datetime(2025, 11, 12, 7, 0), type=Type.RUN, duration_minute=20), # type: ignore[call-arg]
        Activity(user_id=2, title="Run 3", distance=20, description="another test", # type: ignore[call-arg]
                 start_time=datetime(2025, 11, 5, 7, 0), type=Type.RUN, duration_minute=20), # type: ignore[call-arg]     
    ]

    user_routes = [
    UserRoutes(uid=1, rid=1),   # type: ignore[call-arg]
    UserRoutes(uid=1, rid=2),   # type: ignore[call-arg]
    UserRoutes(uid=2, rid=3),   # type: ignore[call-arg]
    ]

    # db.session.add_all(user_routes)
    # db.session.commit()
    
    # db.session.add_all(activities)
    # db.session.commit()

################################################################################
# API JSON Schemas
################################################################################

class ActivitySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Activity
    route_id = auto_field()
    user_id = auto_field()
    username = ma_fields.Method("get_username")

    def get_username(self, activity):
        return activity.user.username if activity.user else None
    

class RouteSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Route

