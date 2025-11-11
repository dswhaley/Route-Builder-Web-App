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
    image_name: Mapped[int] = mapped_column(nullable=False)

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
    admin = User(email='test@gcc.edu', password='reallygoodpassword') # type: ignore
    db.session.add(admin)
    # create some initial example data
    # Create bank records to be inserted
    bank1 = Bank(code="GB1", name="Grove City Bank1",                      # type: ignore[call-arg]
                address="225 bank drive, grove city pa")                   # type: ignore[call-arg]
    bank2 = Bank(code="GB2", name="Grove City Bank2",                      # type: ignore[call-arg]
                address="555 other rd, grove city pa")                     # type: ignore[call-arg]
    bank3 = Bank(code="GB3", name="PGH bank",                              # type: ignore[call-arg]
                address="111 city rd, pittsburgh, pa")                     # type: ignore[call-arg]

    # Create customer records to be inserted
    cust1 = Customer(c_number=1111, name="John Smith", phone="5552223456", # type: ignore[call-arg]
                email="john.smith@gmail.com", membership='G',              # type: ignore[call-arg]
                address="234 middle st, grove city, pa")                   # type: ignore[call-arg]
    cust2 = Customer(c_number=2222, name="Joe Smith", phone="5551113456",  # type: ignore[call-arg]
                email="joe.smith@gmail.com", membership='S',               # type: ignore[call-arg]
                address="234 middle st, grove city, pa")                   # type: ignore[call-arg]
    cust3 = Customer(c_number=3333, name="Jane Brown", phone="5553337890", # type: ignore[call-arg]
            email="jane.brown@gmail.com", membership='S',                  # type: ignore[call-arg]
            address="222 center ave, pittsburgh, pa")                      # type: ignore[call-arg]
    cust4 = Customer(c_number=4444, name="John Brown", phone="5553337890", # type: ignore[call-arg]
                email="john.brown@gmail.com",                              # type: ignore[call-arg]
                address="222 center ave, pittsburgh, pa")                  # type: ignore[call-arg]

    # Create account records to be inserted
    acct1 = Account(customer=cust1, bank=bank1, account_no=121234345609,   # type: ignore[call-arg]
                startdate=date(2005, 6, 1), balance=500.5)                 # type: ignore[call-arg]
    acct2 = Account(customer=cust1, bank=bank1, account_no=121234345610,   # type: ignore[call-arg]
                startdate=date(2007, 8, 29), balance=200.5)                # type: ignore[call-arg]
    acct3 = Account(customer=cust2, bank=bank2, account_no=121234345611,   # type: ignore[call-arg]
                startdate=date(2010, 7, 11), balance=100.5)                # type: ignore[call-arg]
    acct4 = Account(customer=cust3, bank=bank3, account_no=121234345612,   # type: ignore[call-arg]
                startdate=date(2003, 10, 1), balance=1000.5)               # type: ignore[call-arg]
    acct5 = Account(customer=cust3, bank=bank1, account_no=121234345613,   # type: ignore[call-arg]
                startdate=date(2011, 11, 11), balance=50)                  # type: ignore[call-arg]

    # Add all of these records to the session and commit changes
    db.session.add_all((bank1, bank2, bank3, cust1, cust2, cust3, cust4, 
        acct1, acct2, acct3, acct4, acct5))
    db.session.commit()
    db.session.commit()
