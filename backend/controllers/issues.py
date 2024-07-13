from flask import Blueprint, render_template, jsonify, send_from_directory, redirect
from flask_login import login_required, current_user
from .oauth import session, COMPANY_ID
from ..helpers.helpers import api_fetch, aio_fetch_all, simplify_observation
from ..helpers.endpoints import obs_list_url, obs_url, obs_responses_url, \
               trades_url, obs_assignees_url, locations_url, obs_types_url
import asyncio
import json

issues = Blueprint('issues', __name__)

@issues.route("/api/projects/<int:project_id>/issues")
def issues_list(project_id):
   print("hit issues route")
   headers = { 'Authorization': f"Bearer {session.get('access_token')}", 'Procore-Company-Id' : f"{COMPANY_ID}" }
   resp = json.loads(api_fetch("GET", obs_list_url(project_id), headers=headers))
   print(resp)
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
      print(issue)
      # new_issue = simplify_observation(results[f"obs-{issue['id']}"])
      # new_issue = results[f"obs-{issue['id']}"]
      # new_issue['responses'] = results[f"resp-{issue['id']}"]
      new_issue = simplify_observation(issue)
      new_issues.append(new_issue)
   sorted_issues = sorted(new_issues, key=lambda x: x['number'])
   return sorted_issues


@issues.route('/api/projects/<int:project_id>/issues/<int:issue_id>', methods=['GET', 'PATCH', 'DELETE'])
def one_issue(project_id, issue_id):
   url = obs_url(project_id=project_id, obs_id=issue_id)
   pass

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



