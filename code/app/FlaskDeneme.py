from doctest import Example

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:admin@localhost:3306/deneme1'

db = SQLAlchemy(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


class Example(db.Model):
    __tablename__ = 'example'
    id = db.Column('Id', db.Integer, primary_key=True)
    email = db.Column('Email', db.Unicode)

    def __init__(self, email):
        self.email = email

    def toString(self):
        return self.email

if __name__ == '__main__':
    ex = Example("can.tuksavul@dummymail.com")
    db.session.add(ex)
    db.session.commit()
    all = Example.query.all()
    one = Example.query.filter_by(id=1).first()
    for elem in all:
        print 'all: ' + elem.toString()
    print 'one: ' + one.toString()
    app.run()
