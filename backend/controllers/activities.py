from flask import Blueprint, render_template, jsonify, send_from_directory, redirect
from .oauth import session, COMPANY_ID
from ..helpers.helpers import api_fetch, simplify_inspection
from ..helpers.endpoints import insp_list_url, insp_url, insp_att_url, insp_items_url
import threading
import json

activities = Blueprint('activities', __name__)

print('activities blueprint')

@activities.route("/api/projects/<int:project_id>/activities", methods=['GET', 'POST'])
def activities_list(project_id):
   print('getting activities')
   headers = { 'Authorization': f"Bearer {session.get('access_token')}", 'Procore-Company-Id' : f"{COMPANY_ID}" }
   activities_list = api_fetch("GET", insp_list_url(project_id), headers=headers)
   activities_list = json.loads(activities_list)
   print(type(activities_list))
   activities = [simplify_inspection(insp) for insp in activities_list]
   activities = sorted(activities, key=lambda x: x['inspection_date'])
   return activities

@activities.route('/api/projects/<int:project_id>/activities/<int:activity_id>', methods=['GET, PATCH, DELETE'])
def activity(activity_id):
   pass

@activities.route('/api/hey')
def hey():
   return 'hey'
