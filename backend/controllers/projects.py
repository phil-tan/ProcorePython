from flask import Blueprint, render_template, jsonify, send_from_directory, redirect
import http.client
from .oauth import login_required, session
from ..helpers.endpoints import projects_list_url
import json

projects = Blueprint('projects', __name__)   

def api_fetch(method, endpoint):
    conn = http.client.HTTPSConnection("api.procore.com")
    project_headers = { 'Authorization': f"Bearer {session.get('access_token')}" }
    conn.request(method, endpoint, headers=project_headers)
    res = conn.getresponse()
    data = res.read()
    return data

@projects.route("/api/projects")
def list_projects():
   print("listing projects")
   projects = api_fetch("GET", projects_list_url)
   return projects

@projects.route("/api/projects/<int:project_id>")
def get_project(project_id):
   projects = api_fetch("GET", projects_list_url)
   projects = json.loads(projects)
   project = [p for p in projects if int(p["id"]) == project_id][0]
   return project

# @projects.route("/api/projects/<int:project_id>/people")
# def list_project_people(project_id):
#    pass

# @projects.route("/api/projects/<int:project_id>/people")
# def get_person(project_id):
#    pass