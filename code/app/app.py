from flask import Flask

from flask_cors import CORS

from flask_sqlalchemy import get_debug_queries

from modules.weight import weight_routes
from modules.user import user_routes
from modules.food import food_routes
from modules.activity import activity_routes
from modules.access import access_routes
from modules.hello import hello_routes

from db import db

import sys
reload(sys)
sys.setdefaultencoding('utf-8')


def create_app(cfg=None):
    app = Flask(__name__)

    CORS(app)  #enables cross origin resource sharing

    if cfg is None:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:SAC63PEK@localhost:3306/deneme2'
    db.init_app(app)
    # app.after_request(sql_debug)
    with app.app_context():
        db.create_all()

    app.register_blueprint(hello_routes.bp)
    app.register_blueprint(user_routes.bp)
    app.register_blueprint(weight_routes.bp)
    app.register_blueprint(food_routes.bp)
    app.register_blueprint(activity_routes.bp)
    app.register_blueprint(access_routes.bp)

    print "asdf"
    return app
    # app.run()
    # app.run(debug=True, host="0.0.0.0")


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

