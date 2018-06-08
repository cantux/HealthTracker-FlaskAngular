from db import db


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