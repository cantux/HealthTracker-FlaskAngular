from db import db


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