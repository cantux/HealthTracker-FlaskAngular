from food_model import *

from flask import Blueprint, jsonify, make_response, request
from datetime import datetime
from sqlalchemy.sql import func

from services.FCDWrapper import FCD

bp = Blueprint('food_routes', __name__)


# Search NDBO API
@bp.route('/api/food/<chars>', methods=['GET'])
def search_food(chars):
    return make_response(jsonify(FCD.find(chars)))


# Find Measures for NDBO food
@bp.route('/api/food/<ndbno>/measures', methods=['GET'])
def get_measures(ndbno):
    return make_response(jsonify(FCD.get_measures_frontend(ndbno)))


# Add food from NDB to Consumption
@bp.route('/api/user/<int:user_id>/food/new', methods=['POST'])
def create_ndb_food(user_id):
    print "new food arrived"
    food_name = request.json["Name"]
    selected_measure_label = request.json["MeasureLabel"]
    ndbnumber = request.json["NdbNumber"]
    quantity = request.json["Quantity"]
    consumption_date = datetime.strptime(request.json["Date"], "%Y-%m-%d").date()

    # if ndbnumber is not provided this is a user entered food.
    if not ndbnumber:
        print "ndbnumber not provided not implemented"
        return make_response('', 400);

    nutrients = FCD.get_nutrients(ndbnumber)
    measures = FCD.get_measures(nutrients, selected_measure_label)
    new_food = Food(UserId=user_id,
                    Name=food_name,
                    NDBNO=ndbnumber,
                    Date=consumption_date,
                    Label=selected_measure_label,
                    Quantity=quantity)

    db.session.add(new_food)
    db.session.flush()
    db.session.refresh(new_food)

    for m in measures:
        new_consumption = Consumption(UserId=user_id,
                                      FoodId=new_food.Id,
                                      Label=m["label"],
                                      Unit=m["unit"],
                                      Value=m["value"],
                                      Date=consumption_date,
                                      Quantity=quantity,
                                      Total=quantity*m["value"])
        db.session.add(new_consumption)
    db.session.commit()
    return make_response(jsonify(new_food.serialize()))


# Get List of Foods for given dates
@bp.route('/api/user/<int:user_id>/food/<date>', methods=['GET'])
def list_food_of_given_date(user_id, date):
    requested_date = datetime.strptime(date, "%Y-%m-%d").date()

    # get food ids of consumptions on given date
    foods = Food.query.filter_by(UserId=user_id, Date=requested_date).all()

    return make_response(jsonify([f.serialize() for f in foods]))


# Get Food list for date intervals
@bp.route('/api/user/<int:user_id>/consumption/energy/<start_date>/<end_date>', methods=['GET'])
def query_consumption_between_dates(user_id, start_date, end_date):
    date_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    date_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    print 'query_consumption_between_dates converted start: ' + str(date_start) + ' end: ' + str(date_end)

    energy_list = Consumption.query\
        .filter_by(UserId=user_id)\
        .filter_by(Label='Energy')\
        .filter_by(Unit='kcal')\
        .filter(db.between(Consumption.Date, date_start, date_end))\
        .all()

    return make_response(jsonify(energy_list))


# # Get consumption on given date
# @app.route('/api/user/<int:user_id>/consumption/<date>', methods=['GET'])
# def list_consumption_of_given_date(user_id, date):
#     requested_date = datetime.strptime(date, "%Y-%m-%d").date()
#     return make_response(jsonify(Consumption.query.filter_by(UserId=user_id, Date=requested_date, Label="Energy", Unit="kcal").all()))

# Get consumption on given date
@bp.route('/api/user/<int:user_id>/consumption/<date>', methods=['GET'])
def get_energy_consumption_of_given_date(user_id, date):
    requested_date = datetime.strptime(date, "%Y-%m-%d").date()

    return make_response(jsonify(Consumption.query.with_entities(func.sum(Consumption.Total).label('sum'))\
                                 .filter_by(UserId=user_id, Date=requested_date, Label="Energy", Unit="kcal")\
                                 .all()))

#
# # Get consumption on given date
# @app.route('/api/user/<int:user_id>/consumption/<startDate>/<endDate>', methods=['GET'])
# def get_energy_consumption_of_interval(user_id, startDate, endDate):
#     start_date = datetime.strptime(startDate, "%Y-%m-%d").date()
#     end_date = datetime.strptime(endDate, "%Y-%m-%d").date()
#
#     Consumption.query.filter_by(UserId=user_id, Label="Energy", Unit="kcal")\
#         .filter(db.between(Consumption.Date, start_date, end_date))
#     return make_response(jsonify(Consumption.query.with_entities(func.sum(Consumption.Value).label('sum')) \
#                                  .all()))
