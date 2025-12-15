from flask import request, jsonify, abort
from sqlalchemy.sql.expression import select, desc
#from datetime import datetime, UTC
from flask_login import login_required, current_user

from app import db
from app.api import bp
from app.auth.models import UserSchema
from app.core.models import Activity
from app.core.getFromDB import get_activities_by_date, get_activity_by_id, get_user_activity, get_users_routes, get_user
from app.core.changeDB import remove_activity
from flask import jsonify

import os, requests
from dotenv import load_dotenv

from flask_cors import CORS # Import Flask-CORS for handling cross-origin requests


load_dotenv()
CORS(bp) # Enable CORS for your Flask app

GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

################################################################################
# REST API
################################################################################

@bp.delete('/activities/<int:aid>')
@login_required
def delete_activity(aid):

    print(f"Activity ID is: {aid}")
    activity = get_activity_by_id(aid)
    print(f"The activity is: {activity}")
    if activity is None:
        return jsonify({
            "error": "Activity not Found"
        }), 404
    
    if activity.user_id != current_user.id and not current_user.admin:
        return jsonify({
            "error": "You are not authorized to delete this activity"
        }), 401
    
    remove_activity(activity)

    return jsonify({"message": "Activity deleted successfully"}), 200


################################################################################
# GOOGLE API
################################################################################

@bp.get("/")
@login_required
def google_route_wrapper():
    args = request.json

    # if it matches our database, fetch it

    # else, make a new request
    

    return ""


@bp.route('/get-google-api-key', methods=['GET'])
def get_google_api_key():
    # You might want to add authentication/authorization logic here
    # For example, check if the user is logged in before returning the key.
    
    return jsonify({"apiKey": GOOGLE_API_KEY})


@bp.get('/user-info/')
@login_required
def get_user_info():
    """Get a JSON object with the current user's id and email address"""
    schema = UserSchema()
    return jsonify(schema.dump(current_user))