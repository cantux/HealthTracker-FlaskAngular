from user_model import *

from flask import Blueprint, jsonify, make_response, request

bp = Blueprint('user_routes', __name__)


@bp.route('/api/user/<int:user_id>', methods=['PUT'])
def put_user(user_id):
    # TODO: only update unchanged fields
    new_name = request.json["Name"]
    new_surname = request.json["Surname"]
    new_height = request.json["Height"]
    new_password = request.json["Password"]
    User.query.filter_by(Id=user_id).update(Name=new_name, Surname=new_surname, Height=new_height, Password=new_password)
    user = User.query.filter_by(Id=user_id).first()

    if user:
        return make_response(jsonify(user.serialize()))
    return make_response('no such user', 404)


@bp.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.filter_by(Id=user_id).first()

    if user:
        return make_response(jsonify(user.serialize()))
    return make_response('no such user', 404)
