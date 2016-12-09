from doctest import Example

from flask import Flask, jsonify, make_response, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

from datetime import datetime
from datetime import timedelta

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:admin@localhost:3306/deneme2'

db = SQLAlchemy(app)

CORS(app)  #enables cross origin resource sharing


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/api/auth', methods=['POST'])
def login():
    print 'auth request arrived: ' + request.json['password'] + ' ' + request.json['email']
    email = request.json['email']
    user = User.query.filter_by(Email = email).first()

    if user:
        password = request.json['password']
        if user.Password == password:
            return make_response(jsonify({"id": user.Id}))
    else:
        abort(400)


@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    print 'user request arrived user_id: ' + str(user_id)
    user = User.query.filter_by(Id = user_id).first()

    if user:
        return make_response(jsonify(user.serialize()))
    else:
        abort(400)


@app.route('/api/user/<int:user_id>/weight/<start_date>/<end_date>', methods=['GET'])
def get_weight(user_id, start_date, end_date):
    print 'weight request arrived user_id: ' + str(user_id) + ' dates: ' + str(start_date) + ' ' + str(end_date)

    date_start = datetime.strptime(start_date, "%Y-%m-%d").date()
    date_end = datetime.strptime(end_date, "%Y-%m-%d").date()
    print 'dates converted start: ' + str(date_start) + ' end: ' + str(date_end)

    user = User.query.filter_by(Id = user_id).first()
    weight_list = user.Weights.filter(db.between(Weight.Date, date_start, date_end)).all()
    if weight_list:
        return make_response(jsonify(eqtls=[weight.serialize() for weight in weight_list]))
    else:
        abort(400)


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
        print 'weight: ' + str(self.Weight) + ' date: ' + str(self.Date)

    def serialize(self):
        return {
            "Id": self.Id,
            "UserId": self.UserId,
            "Weight": self.Weight,
            "Date": self.Date
        }


class User(db.Model):
    __tablename__ = 'User'
    Id = db.Column('Id', db.Integer, primary_key=True, autoincrement=True, unique=True)
    Email = db.Column('Email', db.Unicode(60), unique=True)
    Name = db.Column('Name', db.Unicode(25))
    Surname = db.Column('Surname', db.Unicode(25))
    Password = db.Column('Password', db.Unicode(25))
    Weights = db.relationship('Weight', lazy="dynamic")

    def __init__(self, email, password):
        self.Email = email
        self.Password = password

    def to_string(self):
        weight_str = ''
        for x in self.Weights:
            weight_str += 'weight: ' + str(x.Weight) + ' date: ' + str(x.Date)
        return self.Email + ' weight: ' + weight_str

    def serialize(self):
        return {
            "Id": self.Id,
            "Email": self.Email,
        }

if __name__ == '__main__':
    db.create_all()
    # first_user = User("email", "pass")
    # db.session.add(first_user)
    # db.session.commit()
    all_users = User.query.all()
    one_user = User.query.filter_by(Id=1).first()
    for elem in all_users:
        print 'all: ' + elem.to_string()

    # weight1 = Weight(one_user.Id, 77, datetime.utcnow())
    # weight2 = Weight(one_user.Id, 76, datetime.utcnow() - timedelta(days=1))
    # db.session.add(weight1)
    # db.session.add(weight2)
    # one_user.Weights.append(weight1)
    # one_user.Weights.append(weight2)
    db.session.commit()

    weight_user = User.query.filter_by(Id=1).first()
    print 'one: ' + weight_user.to_string()

    app.run()
