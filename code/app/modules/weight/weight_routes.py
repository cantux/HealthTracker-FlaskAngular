from modules.user.user_model import *
from modules.weight.weight_model import *
from flask import Blueprint, jsonify, make_response, request, abort

from datetime import datetime

bp = Blueprint('weight_routes', __name__)


#put weight
@bp.route('/api/user/<int:user_id>/weight/<selected_date>', methods=['PUT'])
def post_weight_selected_date(user_id, selected_date):
    new_weight = request.json["Weight"]
    new_date = request.json["Date"]
    converted_date = datetime.strptime(new_date, "%Y-%m-%d").date()

    previous_weight = Weight.query.filter_by(UserId=user_id, Date=converted_date).first()
    if previous_weight:
        previous_weight.Weight=new_weight
        db.session.commit()
        db.session.refresh(previous_weight)
        return make_response(jsonify(previous_weight.serialize()))
    else:
        new_weight = Weight(UserId=user_id,
                            Weight=new_weight,
                            Date=converted_date)

        if new_weight:
            db.session.add(new_weight)
            db.session.commit()
            return make_response(jsonify(new_weight.serialize()))
        else:
            return make_response('', 204)


# Get weight on date
@bp.route('/api/user/<int:user_id>/weight/<selected_date>', methods=['GET'])
def get_weight_selected_date(user_id, selected_date):
    converted_date = datetime.strptime(selected_date, "%Y-%m-%d").date()

    weight = Weight.query.filter_by(UserId=user_id, Date=converted_date).first()
    if weight:
        return make_response(jsonify(weight.serialize()))
    else:
        return make_response('', 204)


# Get weight between dates
@bp.route('/api/user/<int:user_id>/weight/<start_date>/<end_date>', methods=['GET'])
def get_weight_interval(user_id, start_date, end_date):
    date_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    date_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    print 'get weight dates converted start: ' + str(date_start) + ' end: ' + str(date_end)

    user = User.query.filter_by(Id=user_id).first()
    weight_list = user.Weights.filter(db.between(Weight.Date, date_start, date_end)).all()
    if weight_list:
        return make_response(jsonify([weight.serialize() for weight in weight_list]))
    else:
        abort(400)
