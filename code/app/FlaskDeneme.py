from flask import Flask, jsonify, make_response, request, abort
from flask_sqlalchemy import SQLAlchemy, get_debug_queries
from sqlalchemy.sql import func, and_

from flask_cors import CORS, cross_origin

from flask_sqlalchemy import get_debug_queries

from datetime import datetime
from datetime import timedelta

from FCDWrapper import FCD

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:admin@localhost:3306/deneme2'

db = SQLAlchemy(app)

CORS(app)  #enables cross origin resource sharing

# region Debug

def sql_debug(response):
    queries = list(get_debug_queries())
    query_str = ''
    total_duration = 0.0
    for q in queries:
        total_duration += q.duration
        stmt = str(q.statement % q.parameters).replace('\n', '\n       ')
        query_str += 'Query: {0}\nDuration: {1}ms\n\n'.format(stmt, round(q.duration * 1000, 2))

    print '=' * 80
    print ' SQL Queries - {0} Queries Executed in {1}ms'.format(len(queries), round(total_duration * 1000, 2))
    print '=' * 80
    print query_str.rstrip('\n')
    print '=' * 80 + '\n'

    return response

# app.after_request(sql_debug)


@app.route('/')
def hello_world():
    return 'Hello World!'

# endregion Debug

# region Access


@app.route('/api/auth', methods=['POST'])
def login():
    print 'auth request arrived: ' + request.json['Password'] + ' ' + request.json['Email']
    email = request.json['Email']
    user = User.query.filter_by(Email = email).first()

    if user:
        password = request.json['Password']
        if user.Password == password:
            return make_response(jsonify({"Id": user.Id, "Email": user.Email}))
    return make_response('email or password didnt match', 403)

@app.route('/api/auth/new', methods=['POST'])
def register():
    new_email = request.json["Email"]
    new_password = request.json["Password"]
    new_user = User(Email=new_email, Password=new_password)

    db.session.add(new_user)
    db.session.flush()
    db.session.refresh(new_user)
    db.session.commit()

    if new_user:
        return make_response(jsonify(new_user.serialize()))
    return make_response('no such user', 404)

# endregion Access

# region User


@app.route('/api/user/<int:user_id>', methods=['PUT'])
def put_user(user_id):
    # TODO: only update unchanged fields
    new_name = request.json["Name"]
    new_surname = request.json["Surname"]
    new_height = request.json["Height"]
    new_password = request.json["Password"]
    User.query.filter_by(User.Id == user_id).update(Name=new_name, Surname=new_surname, Height=new_height, Password=new_password)
    user = User.query.filter_by(Id=user_id).first()

    if user:
        return make_response(jsonify(user.serialize()))
    return make_response('no such user', 404)


@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.filter_by(Id = user_id).first()

    if user:
        return make_response(jsonify(user.serialize()))
    return make_response('no such user', 404)


class User(db.Model):
    __tablename__ = 'User'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    Email = db.Column('Email', db.Unicode(60), unique=True)
    Name = db.Column('Name', db.Unicode(25))
    Surname = db.Column('Surname', db.Unicode(25))
    Password = db.Column('Password', db.Unicode(25))
    Height = db.Column('Height', db.Integer)
    Weights = db.relationship('Weight', lazy="dynamic")
    # goalWeights
    Activities = db.relationship('Activity', lazy="dynamic")
    Foods = db.relationship('Food', lazy="dynamic")
    Consumptions = db.relationship('Consumption', lazy="dynamic")

    def serialize(self):
        return {
            "Id": self.Id,
            "Email": self.Email,
            "Name": self.Name,
            "Surname": self.Surname,
            "Password": self.Password,
            "Height": self.Height,
        }

# endregion User

# region Activity


@app.route('/api/user/<int:user_id>/activity/<date>', methods=['GET'])
def get_activity(user_id, date):
    requested_date = datetime.strptime(date, "%Y-%m-%d").date()
    activities = Activity.query.filter_by(UserId=user_id, Date=date).all()
    return make_response(jsonify([activity.serialize() for activity in activities]))


@app.route('/api/user/<int:user_id>/activity/new', methods=['POST'])
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


class Activity(db.Model):
    __tablename__ = 'Activity'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    UserId = db.Column('UserId', db.INT, db.ForeignKey('User.Id'))
    Name = db.Column('Name', db.Unicode(200))
    Duration = db.Column('Duration', db.INT)
    CalorieBurned = db.Column('CalorieBurned', db.FLOAT)
    Date = db.Column('Date', db.DATETIME)

    def serialize(self):
        return {
            "Name": self.Name,
            "Duration": self.Duration,
            "CalorieBurned": self.CalorieBurned,
            "Date": self.Date.isoformat()
        }
# endregion Activity

# region Food


# Search NDBO API
@app.route('/api/food/<chars>', methods=['GET'])
def search_food(chars):
    return make_response(jsonify(FCD.find(chars)))


# Find Measures for NDBO food
@app.route('/api/food/<ndbno>/measures', methods=['GET'])
def get_measures(ndbno):
    return make_response(jsonify(FCD.get_measures_frontend(ndbno)))


# Add food from NDB to Consumption
@app.route('/api/user/<int:user_id>/food/new', methods=['POST'])
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
@app.route('/api/user/<int:user_id>/food/<date>', methods=['GET'])
def list_food_of_given_date(user_id, date):
    requested_date = datetime.strptime(date, "%Y-%m-%d").date()

    # get food ids of consumptions on given date
    foods = Food.query.filter_by(UserId=user_id, Date=requested_date).all()

    return make_response(jsonify([f.serialize() for f in foods]))


# Get Food list for date intervals
@app.route('/api/user/<int:user_id>/consumption/energy/<start_date>/<end_date>', methods=['GET'])
def query_consumption_between_dates(user_id, start_date, end_date):
    date_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    date_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    print 'query_consumption_between_dates converted start: ' + str(date_start) + ' end: ' + str(date_end)

    energy_list = Consumption.query\
        .filter_by(UserId=user_id)\
        .filter_by(Label = 'Energy')\
        .filter_by(Unit = 'kcal')\
        .filter(db.between(Consumption.Date, date_start, date_end))\
        .all()

    return make_response(jsonify(energy_list))


# # Get consumption on given date
# @app.route('/api/user/<int:user_id>/consumption/<date>', methods=['GET'])
# def list_consumption_of_given_date(user_id, date):
#     requested_date = datetime.strptime(date, "%Y-%m-%d").date()
#     return make_response(jsonify(Consumption.query.filter_by(UserId=user_id, Date=requested_date, Label="Energy", Unit="kcal").all()))

# Get consumption on given date
@app.route('/api/user/<int:user_id>/consumption/<date>', methods=['GET'])
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
class Food(db.Model):
    __tablename__ = 'Food'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    UserId = db.Column('UserId', db.INT, db.ForeignKey('User.Id'))
    Consumptions = db.relationship('Consumption', lazy="dynamic")
    Name = db.Column('Name', db.Unicode(200))
    NDBNO = db.Column('NDBNO', db.Unicode(20))
    Date = db.Column('Date', db.DATETIME)
    Label = db.Column('Label', db.Unicode(40))
    Quantity = db.Column('Quantity', db.FLOAT)

    def serialize(self):
        return {
            "Name": self.Name,
            "MeasureLabel": self.Label,
            "NdbNumber": self.NDBNO,
            "Quantity": self.Quantity,
            "Date": self.Date.isoformat()
        }


class Consumption(db.Model):
    __tablename__ = 'Consumption'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    UserId = db.Column('UserId', db.INT, db.ForeignKey('User.Id'))
    FoodId = db.Column('FoodId', db.INT, db.ForeignKey('Food.Id'))
    Label = db.Column('Label', db.Unicode(40))
    Unit = db.Column('Unit', db.Unicode(10))
    Value = db.Column('Value', db.FLOAT)
    Date = db.Column('Date', db.DATETIME)
    Quantity = db.Column('Quantity', db.FLOAT)
    Total = db.Column('Total', db.FLOAT)

    def serialize(self):
        return {
            "Label": self.Label,
            "Date": self.Date.date,
            "Total": self.Total
        }

# endregion

# region Weight

#put weight
@app.route('/api/user/<int:user_id>/weight/<selected_date>', methods=['PUT'])
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
@app.route('/api/user/<int:user_id>/weight/<selected_date>', methods=['GET'])
def get_weight_selected_date(user_id, selected_date):
    converted_date = datetime.strptime(selected_date, "%Y-%m-%d").date()

    weight = Weight.query.filter_by(UserId=user_id, Date=converted_date).first()
    if weight:
        return make_response(jsonify(weight.serialize()))
    else:
        return make_response('', 204)


# Get weight between dates
@app.route('/api/user/<int:user_id>/weight/<start_date>/<end_date>', methods=['GET'])
def get_weight_interval(user_id, start_date, end_date):
    date_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    date_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    print 'get weight dates converted start: ' + str(date_start) + ' end: ' + str(date_end)

    user = User.query.filter_by(Id = user_id).first()
    weight_list = user.Weights.filter(db.between(Weight.Date, date_start, date_end)).all()
    if weight_list:
        return make_response(jsonify([weight.serialize() for weight in weight_list]))
    else:
        abort(400)


class Weight(db.Model):
    __tablename__ = 'Weight'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    UserId = db.Column('UserId', db.INT, db.ForeignKey('User.Id'))
    Weight = db.Column('Weight', db.INT)
    Date = db.Column('Date', db.DATETIME)

    def serialize(self):
        return {
            "Weight": self.Weight,
            "Date": self.Date
        }

# endregion Weight



with app.app_context():
    db.create_all()
first_user = User(Email="email", Password="pass")
db.session.add(first_user)
db.session.commit()

app.run()
    # app.run(debug=True, host="0.0.0.0")


