from flask import Blueprint, jsonify
from backend import db
import json

api = Blueprint('api', __name__)

@api.route('/api/data')
def get_data():
    data = {'message': 'This is the Procore App'}
    return jsonify(data)
