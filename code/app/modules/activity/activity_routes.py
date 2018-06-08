from db import db

from activity_model import Activity

from datetime import datetime

from flask import Blueprint, jsonify, make_response, request

bp = Blueprint('activity_routes', __name__)


@bp.route('/api/user/<int:user_id>/activity/<date>', methods=['GET'])
def get_activity(user_id, date):
    requested_date = datetime.strptime(date, "%Y-%m-%d").date()
    activities = Activity.query.filter_by(UserId=user_id, Date=date).all()
    return make_response(jsonify([activity.serialize() for activity in activities]))


@bp.route('/api/user/<int:user_id>/activity/new', methods=['POST'])
def post_activity(user_id):
    new_name = request.json["Name"]
    new_duration = request.json["Duration"]
    new_calorie_burned = request.json["CalorieBurned"]
    new_date = request.json["Date"]

    new_activity = Activity(UserId=user_id,
                            Name=new_name,
                            Duration=new_duration,
                            CalorieBurned=new_calorie_burned,
                            Date=new_date)
    db.session.add(new_activity)
    db.session.commit()
    return make_response(jsonify(''), 200)