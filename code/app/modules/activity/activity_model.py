from db import db


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