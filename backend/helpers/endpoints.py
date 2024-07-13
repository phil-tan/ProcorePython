from ..controllers.oauth  import CLIENT_ID, BASE_URL, COMPANY_ID


#trades
def trades_url():
  return f"{BASE_URL}/rest/v1.0/companies/{COMPANY_ID}/trades"

def locations_url(project_id):
  return f"{BASE_URL}/rest/v1.0/projects/{project_id}/locations"

#projects
projects_list_url = f"{BASE_URL}/rest/v1.1/projects?company_id={COMPANY_ID}&page=1&per_page=300&filters[by_status]=Active"
project_url = f"/rest/v1.1/projects?company_id={COMPANY_ID}&filters[id]=PROJECT_ID&view=normal"

#observations
def obs_list_url(project_id):
  return f"{BASE_URL}/rest/v1.0/observations/items?project_id={project_id}"

def obs_url(obs_id, project_id):
  return f"{BASE_URL}/rest/v1.0/observations/items/{obs_id}?project_id={project_id}"

def obs_responses_url(obs_id, project_id):
  return f"{BASE_URL}/rest/v1.0/observations/items/{obs_id}/response_logs?project_id={project_id}"

# obs_pdf_url =  "/rest/v1.0/observations/items/OBS_ID/pdf?project_id=PROJECT_ID"

def obs_types_url(project_id):
  return f"{BASE_URL}/rest/v1.0/projects/{project_id}/observation_types"

def obs_assignees_url(project_id):
  return f"{BASE_URL}/rest/v1.0/observations/assignees?project_id={project_id}"

#inspections
def insp_list_url(project_id):
  return f"{BASE_URL}/rest/v1.1/projects/{project_id}/checklist/lists"

def insp_url(project_id, insp_id):
  return f"{BASE_URL}/rest/v1.0/projects/{project_id}/checklist/lists/{insp_id}"

def insp_att_url(project_id, insp_id):
  return f"{BASE_URL}/rest/v1.0/projects/{project_id}/checklist/lists/{insp_id}/attachments"

def insp_items_url(project_id, insp_id):
  return f"{BASE_URL}/rest/v1.0/projects/{project_id}/checklist/list_items?filters[list_id]={insp_id}"

#photos
albums_url = f"{BASE_URL}/rest/v1.0/image_categories?project_id=PROJECT_ID"
query_params = {
        'project_id' : 'params[:project_id]',
        'image_category_id' : 'this_album["id"]',
        'page' : '1',
        'per_page' : '1000',
        'sort' : 'taken_at'
      }
query_string = "&".join([f"{key}={value}" for key, value in query_params.items()])
photos_url = f"{BASE_URL}/rest/v1.0/images?{query_string}"