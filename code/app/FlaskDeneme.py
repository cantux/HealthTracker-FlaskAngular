from flask import Flask, jsonify, make_response, request, abort
from flask_sqlalchemy import SQLAlchemy

from flask_cors import CORS, cross_origin

from flask_sqlalchemy import get_debug_queries

from datetime import datetime
from datetime import timedelta

import requests

from FCDWrapper import FCD

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

app.after_request(sql_debug)


@app.route('/')
def hello_world():
    return 'Hello World!'

# endregion Debug

# region User

class User(db.Model):
    __tablename__ = 'User'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    Email = db.Column('Email', db.Unicode(60), unique=True)
    Name = db.Column('Name', db.Unicode(25))
    Surname = db.Column('Surname', db.Unicode(25))
    Password = db.Column('Password', db.Unicode(25))
    Weights = db.relationship('Weight', lazy="dynamic")
    Foods = db.relationship('Food', lazy="dynamic")
    Consumptions = db.relationship('Consumption', lazy="dynamic")

    def __init__(self, email, password):
        self.Email = email
        self.Password = password

    def to_string(self):
        weight_str = ",".join([x.to_string() for x in self.Weights])
        return self.Email + ' weight: ' + weight_str

    def serialize(self):
        return {
            "Id": self.Id,
            "Email": self.Email,
        }

# endregion User

# region Access
@app.route('/api/auth', methods=['POST'])
def login():
    print 'auth request arrived: ' + request.json['password'] + ' ' + request.json['email']
    email = request.json['email']
    user = User.query.filter_by(Email = email).first()

    if user:
        password = request.json['password']
        if user.Password == password:
            return make_response(jsonify({"id": user.Id}))
    return make_response('email or password didnt match', 403)


@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    print 'user request arrived user_id: ' + str(user_id)
    user = User.query.filter_by(Id = user_id).first()

    if user:
        return make_response(jsonify(user.serialize()))
    return make_response('no such user', 404)

# endregion Access

# region Weight

class Weight(db.Model):
    __tablename__ = 'Weight'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    UserId = db.Column('UserId', db.INT, db.ForeignKey('User.Id'))
    Weight = db.Column('Weight', db.INT)
    Date = db.Column('Date', db.DATETIME)

    def __init__(self, user_id, weight, date):
        self.UserId = user_id
        self.Date = date
        self.Weight = weight

    def to_string(self):
        return 'weight: ' + str(self.Weight) + ' date: ' + str(self.Date)

    def serialize(self):
        return {
            "Id": self.Id,
            "UserId": self.UserId,
            "Weight": self.Weight,
            "Date": self.Date
        }

# Get weight between dates
@app.route('/api/user/<int:user_id>/weight/<start_date>/<end_date>', methods=['GET'])
def get_weight(user_id, start_date, end_date):
    date_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    date_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    print 'get weight dates converted start: ' + str(date_start) + ' end: ' + str(date_end)

    user = User.query.filter_by(Id = user_id).first()
    weight_list = user.Weights.filter(db.between(Weight.Date, date_start, date_end)).all()
    if weight_list:
        return make_response(jsonify([weight.serialize() for weight in weight_list]))
    else:
        abort(400)

# endregion Weight

# region Food


# Search NDBO API
@app.route('/api/food/<chars>', methods=['GET'])
def search_food(chars):
    return make_response(jsonify(FCD.find(chars)))


# Find Measures for NDBO food
@app.route('/api/food/<ndbno>/measures', methods=['GET'])
def get_measures(ndbno):
    return make_response(jsonify(FCD.get_measures_frontend(ndbno)))


# Create Food
@app.route('/api/food/new', methods=['POST'])
def create_new_food(user_id):
    new_food = Food(UserId=user_id, Name=request.json["Name"])
    db.session.add(new_food)

    # for loops
    nutrients = request.json["Nutrients"]
    for nutrient in nutrients:
        new_nutrient = Nutrient(FoodId=new_food.Id, Name=nutrient["Name"], Unit=nutrient["Unit"])
        db.session.add(new_nutrient)
        for measure in nutrients["Measures"]:
            new_measure = Measure(FoodId=new_food.Id, NutrientId=new_nutrient.Id, Label=measure["Label"], Value=measure["Value"])
            db.session.add(new_measure)

    db.session.commit()


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

    # if ndbnumber hasn't been used before we fill our database
    elif Food.query.filter_by(NDBNO=ndbnumber).first() is None:
        nutrients = FCD.get_nutrients(ndbnumber)
        measures = FCD.get_measures(nutrients, selected_measure_label)

        print "measures length: " + str(len(measures))
        new_food = Food(UserId=user_id, Name=food_name, NDBNO=ndbnumber)
        db.session.add(new_food)
        db.session.flush()
        db.session.refresh(new_food)
        # for loops
        measures_count = 0
        nutrients_count = 0
        for nutrient in nutrients:
            nutrients_count += 1
            new_nutrient = Nutrient(FoodId=new_food.Id, Name=nutrient["name"], Unit=nutrient["unit"])
            db.session.add(new_nutrient)
            db.session.flush()
            db.session.refresh(new_nutrient)
            for measure in nutrient["measures"]:
                measures_count += 1
                new_measure = Measure(FoodId=new_food.Id, NutrientId=new_nutrient.Id, Label=measure["label"],
                                      Value=measure["value"], Eqv=measure["eqv"])
                db.session.add(new_measure)

        print 'nutrients_count: ' + str(nutrients_count)
        print 'measures_count: ' + str(nutrients_count)
        db.session.commit()

    existing_ndb_food = Food.query.filter_by(NDBNO=ndbnumber).first()
    existing_nutrients = existing_ndb_food.Nutrients.all()


    # selected_measures = existing_nutrients.Measures \
    #     .filter_by(Label=selected_measure_label) \
    #     .all()

    # fuzzy_join = db.session.query(existing_nutrients) \
    #     .join(existing_nutrients.Measures) \
    #     .filter(Measure.Label == selected_measure_label).all()

    db.session.query(Nutrient).join(Measure).filter(Measure.Label==selected_measure_label)
    db.session.query(existing_ndb_food.Nutrients).join(existing_ndb_food.Nutrients).filter_by(Label=selected_measures)
    # sanity check
    if existing_nutrients.count() != selected_measures.count():
        return make_response('nutrients and selected measures count doesnt hold up', 500)

    for m in selected_measures:
        new_consumption = Consumption(UserId=user_id,
                                      FoodId=existing_ndb_food.Id,
                                      NutrientId=existing_nutrients.Id,
                                      MeasureId=m.Id,
                                      Date=consumption_date,
                                      Quantity=quantity)
        db.session.add(new_consumption)
    db.session.commit()
    return make_response(jsonify(existing_ndb_food))



# Get List of Foods for given dates
# @app.route('/api/user/<int:user_id>/food/<date>', methods=['GET'])
def list_food_of_given_date(user_id, date):
    requested_date = datetime.strptime(date, "%Y-%m-%d").date()

    # get food ids of consumptions on given date
    food_ids = Consumption.query(Consumption.FoodId)\
        .filter_by(UserId=user_id, Date=requested_date)\
        .distinct(Consumption.FoodId)\
        .all()

    return make_response(jsonify(Food.query().join(food_ids).all()))


# Create consumption for current date
@app.route('/api/user/<int:user_id>/consumption/<date>', methods=['POST'])
def add_consumption(user_id, date):
    food = Food.query().filter_by(Id=request.json["FoodId"]).first()

    measures = food.Measures.filter_by(Label=request.json["MeasureLabel"])

    requested_date = datetime.strptime(date, "%Y-%m-%d").date()

    requested_quantity = request.json["Quantity"]

    for nutrient in food.Nutrients.all():
        for measure in measures:
            new_consumption = Consumption(UserId=user_id,
                                          FoodId=food.Id,
                                          NutrientId=nutrient.Id,
                                          MeasureId=measure.Id,
                                          Date=requested_date,
                                          Quantity=requested_quantity)
            db.session.add(new_consumption)
    db.session.commit()


# Get consumption on given date
@app.route('/api/user/<int:user_id>/consumption/<date>', methods=['GET'])
def list_consumption_of_given_date(user_id, date):
    requested_date = datetime.strptime(date, "%Y-%m-%d").date()
    return make_response(jsonify(Consumption.query().filter_by(UserId=user_id, Date=requested_date).all()))


# Get Consumption list for date intervals
@app.route('/api/user/<int:user_id>/consumption/<start_date>/<end_date>', methods=['GET'])
def query_consumption_between_dates(user_id, start_date, end_date):
    date_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    date_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    print 'query_consumption_between_dates converted start: ' + str(date_start) + ' end: ' + str(date_end)
    return make_response(jsonify(Consumption.query()\
        .filter_by(UserId=user_id)\
        .filter(db.between(Weight.Date, date_start, date_end))\
        .all()))


class Food(db.Model):
    __tablename__ = 'Food'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    UserId = db.Column('UserId', db.INT, db.ForeignKey('User.Id'))
    Name = db.Column('Name', db.Unicode(200))
    NDBNO = db.Column('NDBNO', db.Unicode(20))
    Nutrients = db.relationship('Nutrient', lazy="dynamic")
    Measures = db.relationship('Measure', lazy="dynamic")
    Consumptions = db.relationship('Consumption', lazy="dynamic")


class Nutrient(db.Model):
    __tablename__ = 'Nutrient'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    FoodId = db.Column('FoodId', db.INT, db.ForeignKey('Food.Id'))
    Name = db.Column('Name', db.Unicode(25))
    Unit = db.Column('Unit', db.Unicode(25))
    Measures = db.relationship('Measure', lazy="dynamic")
    Consumptions = db.relationship('Consumption', lazy="dynamic")


class Measure(db.Model):
    __tablename__ = 'Measure'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    FoodId = db.Column('FoodId', db.INT, db.ForeignKey('Food.Id'))
    NutrientId = db.Column('NutrientId', db.INT, db.ForeignKey('Nutrient.Id'))
    Label = db.Column('Label', db.Unicode(25))
    Value = db.Column('Value', db.FLOAT)
    Eqv = db.Column('Eqv', db.FLOAT)
    Consumptions = db.relationship('Consumption', lazy="dynamic")


class Consumption(db.Model):
    __tablename__ = 'Consumption'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    UserId = db.Column('UserId', db.INT, db.ForeignKey('User.Id'))
    FoodId = db.Column('FoodId', db.INT, db.ForeignKey('Food.Id'))
    NutrientId = db.Column('NutrientId', db.INT, db.ForeignKey('Nutrient.Id'))
    MeasureId = db.Column('MeasureId', db.INT, db.ForeignKey('Measure.Id'))
    Date = db.Column('Date', db.DATETIME)
    Quantity = db.Column('Quantity', db.FLOAT)

# endregion


if __name__ == '__main__':
    # db.create_all()
    # first_user = User("email", "pass")
    # db.session.add(first_user)
    # db.session.commit()
    # all_users = User.query.all()
    # one_user = User.query.filter_by(Id=1).first()
    # for elem in all_users:
    #     print 'all: ' + elem.to_string()
    #
    # weight1 = Weight(one_user.Id, 77, datetime.utcnow())
    # weight2 = Weight(one_user.Id, 76, datetime.utcnow() - timedelta(days=1))
    # db.session.add(weight1)
    # db.session.add(weight2)
    # one_user.Weights.append(weight1)
    # one_user.Weights.append(weight2)
    # db.session.commit()


    # weight_user = User.query.filter_by(Id=1).first()
    # print 'one: ' + weight_user.to_string()
    #
    # selected_ndbno = "01009"
    # print FCD.get_measures_frontend(selected_ndbno)
    # app.run()
    app.run(debug=True)


