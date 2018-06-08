from db import db


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