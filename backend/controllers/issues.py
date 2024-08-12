from flask import Blueprint, send_from_directory, redirect, request, jsonify
from flask_login import login_required, current_user
from .oauth import session, COMPANY_ID
from ..helpers.helpers import api_fetch, aio_fetch_all, simplify_observation, issue_update_http
from ..helpers.endpoints import obs_list_url, obs_url, obs_responses_url, \
               trades_url, obs_assignees_url, locations_url, obs_types_url, delete_obs_url
import asyncio
import json
import requests

issues = Blueprint('issues', __name__)

@issues.route("/api/projects/<int:project_id>/issues", methods=['GET', 'POST'])
def issues_list(project_id):
   print("hit issues route")
   if request.method == 'GET':
      headers = { 'Authorization': f"Bearer {session.get('access_token')}", 'Procore-Company-Id' : f"{COMPANY_ID}" }
      resp = json.loads(api_fetch("GET", obs_list_url(project_id), headers=headers))
      if not isinstance(resp, list):
         return resp.get('message')
      issues_list = resp
      # issue_urls = {}
      # issue_responses_urls = {}
      # for issue in issues_list:
      #    issue_urls[f"obs-{issue['id']}"] = obs_url(obs_id=issue["id"], project_id=project_id)
      #    issue_responses_urls[f"resp-{issue['id']}"] = obs_responses_url(obs_id=issue['id'], project_id=project_id)
      # merged_urls = {**issue_urls, **issue_responses_urls}
      # results = asyncio.run(aio_fetch_all(url_dict=merged_urls, headers=headers))
      new_issues = []
      for issue in issues_list:
         # new_issue = simplify_observation(results[f"obs-{issue['id']}"])
         # new_issue = results[f"obs-{issue['id']}"]
         # new_issue['responses'] = results[f"resp-{issue['id']}"]
         new_issue = simplify_observation(issue)
         new_issues.append(new_issue)
      sorted_issues = sorted(new_issues, key=lambda x: x['number'])
      return sorted_issues
   elif request.method == 'POST': # POST (create)
      headers = { 'Authorization': f"Bearer {session.get('access_token')}", 'Procore-Company-Id' : f"{COMPANY_ID}", 
            'content-type': "multipart/form-data; boundary=---011000010111000001101001" }
      created_item = issue_update_http(request=request, headers=headers, project_id=project_id, issue_id=None)
      print(created_item)
      return created_item


@issues.route('/api/projects/<int:project_id>/issues/<int:issue_id>', methods=['GET', 'PATCH', 'POST', 'DELETE'])
def one_issue(project_id, issue_id):
   #Edit
   return_item = {}
   if request.method in ['PATCH','POST']:
      headers = { 'Authorization': f"Bearer {session.get('access_token')}", 'Procore-Company-Id' : f"{COMPANY_ID}", 
            'content-type': "multipart/form-data; boundary=---011000010111000001101001" }
      return_item = issue_update_http(request, headers, project_id, issue_id)
   elif request.method in ['DELETE']:
      headers = { 'Authorization': f"Bearer {session.get('access_token')}", 'Procore-Company-Id' : f"{COMPANY_ID}" }
      resp = requests.delete(delete_obs_url(project_id=project_id, obs_id=issue_id), headers=headers)
      return_item = resp.text
      print(resp.url)
      print(resp)
   return return_item

@issues.route('/api/projects/<int:project_id>/issues/fields', methods=['GET', 'PATCH', 'DELETE'])
def issue_fields(project_id):
   headers = { 'Authorization': f"Bearer {session.get('access_token')}", 'Procore-Company-Id' : f"{COMPANY_ID}" }
   urls = {}
   urls['trades'] = trades_url()
   urls['locations'] = locations_url(project_id)
   urls['assignees'] = obs_assignees_url(project_id)
   urls['types'] = obs_types_url(project_id)
   results = asyncio.run(aio_fetch_all(url_dict=urls, headers=headers))
   return results


@issues.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory('./images/', filename, as_attachment=True)



