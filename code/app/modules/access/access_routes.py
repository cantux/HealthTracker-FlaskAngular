from modules.user.user_model import *

from flask import Blueprint, jsonify, make_response, request

bp = Blueprint('access_routes', __name__)


@bp.route('/api/auth', methods=['POST'])
def login():
    print 'auth request arrived: ' + request.json['Password'] + ' ' + request.json['Email']
    email = request.json['Email']
    user = User.query.filter_by(Email = email).first()

    if user:
        password = request.json['Password']
        if user.Password == password:
            return make_response(jsonify({"Id": user.Id, "Email": user.Email}))
    return make_response('email or password didnt match', 403)


@bp.route('/api/auth/new', methods=['POST'])
def register():
    new_email = request.json["Email"]
    new_password = request.json["Password"]
    new_user = User(Email=new_email, Password=new_password)

    db.session.add(new_user)
    db.session.flush()
    db.session.refresh(new_user)
    db.session.commit()

    if new_user:
        return make_response(jsonify(new_user.serialize()))
    return make_response('no such user', 404)
