from flask import Blueprint

bp = Blueprint('hello_routes', __name__)


@bp.route('/')
def hello_world():
    return 'Hello World!'
