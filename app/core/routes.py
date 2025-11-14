from typing import Sequence, Tuple
from sqlalchemy import Row, Select
from flask import  render_template, redirect, url_for, current_app
from flask_login import login_required, current_user
from flask import redirect, url_for, render_template, flash

from app import db
from app.core import bp
from app.core.forms import ActivityForm
from app.auth.models import User
from app.core.models import Activity, UserRoutes, Route, Type
import os
from dotenv import load_dotenv

from .getFromDB import get_activities_by_date, get_user_activity, get_users_routes, get_route, get_user, get_user_total_miles_given_activity


load_dotenv()

@bp.get("/create_activity/")
@login_required
def add_activity_form():
    form = ActivityForm()

    user_route_links = UserRoutes.query.filter_by(uid=current_user.id).all()
    user_route_ids = [ur.rid for ur in user_route_links]
    routes = Route.query.filter(Route.rid.in_(user_route_ids)).all()

    form.route.choices = [('', '-- None --')] + [(str(r.rid), r.route_name) for r in routes]    # type: ignore[assignment]

    return render_template("activity.html", form = form)

@bp.get("/my_activities/<int:id>/")
@login_required
def get_activities(id):
    activities = get_user_activity(id)
    return render_template("activities.html", activites=activities)


@bp.get("/home3/")
@login_required
def get_home():
    home_activities = get_activities_by_date()
    return render_template("home3.html", activities=home_activities)


@bp.post("/create_activity/")
@login_required
def add_activity():
    form = ActivityForm()

    # Load user’s routes (must be repeated for POST)
    user_route_links = UserRoutes.query.filter_by(uid=current_user.id).all()
    user_route_ids = [ur.rid for ur in user_route_links]
    routes = Route.query.filter(Route.rid.in_(user_route_ids)).all()

    form.route.choices = [('', '-- None --')] + [(str(r.rid), r.route_name) for r in routes]  # type: ignore[assignment]
    if form.validate_on_submit():
        title = form.title.data
        type = Type[form.type.data]
        start_time = form.start_time.data
        duration_minutes = form.duration_minutes.data

        #no route selected
        if not form.route.data:
            if not form.distance.data:
                flash("Please enter a distance or select a route.")
                return redirect(url_for('core.add_activity_form'))
            distance_val = form.distance.data
            route_id = None

        else:
            selected_route = Route.query.get(int(form.route.data))
            distance_val = selected_route.distance  # type: ignore[call-arg]
            route_id = selected_route.rid           # type: ignore[call-arg]

        activity = Activity(user_id=current_user.id, title=title, type=type, start_time=start_time, duration_minute=duration_minutes, distance=distance_val, route_id=route_id) # type: ignore[call-arg]
        db.session.add(activity)
        db.session.commit()

        for i in get_activities_by_date():
            print(f"{i.title}: By User: {i.user.username} for {i.duration_minute} mins")
    else:
        for field,error_msg in form.errors.items():
            flash(f"{field}: {error_msg}")
            return redirect(url_for('core.add_activity_form'))

    return redirect(url_for('core.go_home'))


@bp.get("/profile/")
@login_required
def get_profile():
    run_miles = get_user_total_miles_given_activity(current_user.id, Type.RUN)
    ride_miles = get_user_total_miles_given_activity(current_user.id, Type.RIDE)

    print(f"{current_user.username} ran {run_miles} miles and biked {ride_miles} miles.")
    return render_template("profile.html", user=current_user, run_miles=run_miles, ride_miles=ride_miles)

@bp.get("/")
@bp.get("/home/")
def go_home():
    return render_template("home.html")
# @bp.get('/')
# @login_required
# def index():
#     return redirect(url_for('core.get_accounts'))

@bp.route("/create_route/")
def create_route():
    google_key = os.getenv("GOOGLE_MAPS_API_KEY")
    return render_template('create_route.html', GOOGLE_MAPS_API_KEY=google_key)

# @bp.get('/accounts/')
# @login_required
# def get_accounts():
#     accounts: list[Account] = get_all_accounts()
#     return render_template('index.html', accounts=accounts)

# # TODO: define routes for listing Banks and Customers
# @bp.get('/banks/')
# @login_required
# def get_banks():
#     query: Select[Tuple[Account]] = db.select(Bank)
#     rows = db.session.execute(query).all()
#     banks = [row[0] for row in rows]

#     return render_template('banks.html', banks=banks)

# @bp.get('/customers/')
# @login_required
# def get_customers():
#     query: Select[Tuple[Account]] = db.select(Customer)
#     rows = db.session.execute(query).all()
#     customers = [row[0] for row in rows]

#     return render_template('customers.html', customers=customers)



# def get_all_accounts() -> list[Account]:
#     query: Select[Tuple[Account]] = db.select(Account)
#     rows:  Sequence[Row[Tuple[Account]]] = db.session.execute(query).all()
#     accounts: list[Account] = [row[0] for row in rows]
#     return accounts
