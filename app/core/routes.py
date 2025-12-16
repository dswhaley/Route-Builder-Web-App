from typing import Sequence, Tuple
from sqlalchemy import Row, Select
from flask import  render_template, redirect, request, url_for, current_app, jsonify
from flask_login import login_required, current_user
from flask import redirect, url_for, render_template, flash
from app.auth.models import User, UserSchema

from app import db
from app.core import bp
from app.core.forms import ActivityForm
from app.auth.models import User
from app.core.models import Activity, UserRoutes, Route, Type, RouteSchema
import os
import requests
from dotenv import load_dotenv

from .models import ActivitySchema
from .getFromDB import get_activities_by_date, get_user_activity, get_users_routes, get_route, get_user_total_miles_given_activity


load_dotenv()

@bp.get("/create_activity/")
@login_required
def add_activity_form():
    form = ActivityForm()

    user_route_links = UserRoutes.query.filter_by(uid=current_user.id).all()
    user_route_ids = [ur.rid for ur in user_route_links]
    routes = Route.query.filter(Route.rid.in_(user_route_ids)).all()

    form.route.choices = [('', '-- None --')] + [(str(r.rid), r.route_name) for r in routes]    # type: ignore[assignment]

    return render_template("activity.html", form=form, routes=routes)

@bp.get("/my_activities/<int:id>/")
@login_required
def get_activities(id):
    activities = get_user_activity(id)
    return render_template("activities.html", activites=activities)


@bp.get("/home3/")
@login_required
def get_home():
    home_activities = get_activities_by_date()
    #return render_template("home3.html", activities=home_activities)
    return home_activities


@bp.get("/activity_json/")
def get_activites_json5():
    home_activities = get_activities_by_date()
    schema = ActivitySchema()
    return jsonify(schema.dump(home_activities, many=True))

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
    home_activities = get_activities_by_date()
    return render_template("home.html", activities = home_activities, user=current_user)
# @bp.get('/')
# @login_required
# def index():
#     return redirect(url_for('core.get_accounts'))

@bp.route("/create_route/")
@login_required
def create_route():
    google_key = os.getenv("GOOGLE_MAPS_API_KEY")
    return render_template('create_route.html', GOOGLE_MAPS_API_KEY=google_key, user=current_user)

@bp.post("/add_route/")
@login_required
def add_route_to_db():
    response = request.json

    print("ROUTE HIT")   # ← MUST appear in terminal
    print(request.json)
        
    route = Route(
        distance=response["distance"], #type: ignore
        elevation=response["elevation"], #type: ignore
        route_name=response["route_name"], #type: ignore
        coord_string=response["coord_string"], #type: ignore
        image_name=response["image_name"], #type: ignore
    )
    db.session.add(route)
    db.session.commit()

    return jsonify({"ok": True}), 201
    

@bp.post("/save_route_image/")
@login_required
def save_route_image():
    data = request.get_json()

    image_url = data.get("image_url")
    image_name = data.get("image_name", "route.png")

    if not image_url:
        return jsonify({"error": "Missing image_url"}), 400

    # app/static/route_images
    save_dir = os.path.join(current_app.root_path, "static", "route_images")
    os.makedirs(save_dir, exist_ok=True)

    image_path = os.path.join(save_dir, image_name)

    try:
        resp = requests.get(image_url, timeout=10)
        resp.raise_for_status()

        with open(image_path, "wb") as f:
            f.write(resp.content)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "ok": True,
        "image_path": f"/static/route_images/{image_name}"
    }), 201



@bp.get("/routes_json/")
def get_routes():
    query = db.select(Route)
    rows = db.session.execute(query).all()
    
    routes = [row[0] for row in rows]
    schema = RouteSchema()
    return jsonify(schema.dump(routes, many=True))


@bp.post('/user_json/<int:uid>')
def get_user(uid):
    query = db.select(User).where(User.id == uid)
    rows = db.session.execute(query).all()
    
    user = [row[0] for row in rows]
    schema = UserSchema()
    return jsonify(schema.dump(user, many=False))

