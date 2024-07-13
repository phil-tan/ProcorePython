
from flask import Blueprint, render_template, jsonify, send_from_directory, redirect
import http.client
from ..controllers.oauth import CLIENT_ID, BASE_URL, COMPANY_ID, login_required, session
import asyncio
import aiohttp
from datetime import datetime
from dateutil.parser import parse
from copy import copy


def api_fetch(method, endpoint, headers):
    conn = http.client.HTTPSConnection("api.procore.com")
    print(headers)
    print(endpoint)
    conn.request(method, endpoint, headers=headers)
    res = conn.getresponse()
    data = res.read()
    return data

# Function to fetch data from an API
async def aio_get(aiohttp_session, url, headers):
    async with aiohttp_session.get(url, headers=headers) as response:
        return await response.json()

# Main function to handle multiple concurrent API calls
async def aio_fetch_all(url_dict, headers):
    async with aiohttp.ClientSession() as aiohttp_session:
        tasks = {key: aio_get(aiohttp_session, url, headers=headers) for key, url in url_dict.items()}
        
        # Gather all the results
        results = await asyncio.gather(*tasks.values())
        
        # Construct the result dictionary of dictionaries
        result_dict = {key: result for key, result in zip(tasks.keys(), results)}
        return result_dict
    
    
def simplify_observation(item):
    new_item = {}
    new_item['id'] = item['id']
    new_item['number'] = int(item['number'])
    new_item['item_date'] = item_date(item) if item_date(item) else format_date(item['created_at'])
    # new_item['item_date'] = item['created_at']
    new_item['name'] = item['name']
    new_item['description'] = item['description_rich_text']
    new_item['status'] = item['status'].capitalize()
    new_item['trade'] = item['trade']['name'] if item.get('trade') else None
    new_item['action_by'] = item['assignee']['vendor']['name'] if item.get('assignee') and item['assignee'].get('vendor') else None
    new_item['assignee'] = item.get('assignee')
    new_item['attachments'] = item['attachments'] if item.get('attachments') else []
    new_item['created_by'] = item['created_by']['name']
    new_item['type'] = item['type']['name']
    # new_item['updated_at'] = format_date(item.updated_at)
    new_item['original'] = item
    new_item['inspection_id'] = item['origin']['payload']['checklist_list_id'] if item.get('origin') and item['origin'].get('payload') else None
    new_item['location'] = item['location']['name'] if item.get('location') else None
    new_item['priority'] = item.get('priority')
    new_item['loading'] = False
    new_item['responses'] = item.get('responses') if item.get('responses') else []
    return new_item

def simplify_inspection(orig_insp):
    insp = copy(orig_insp)
    insp['inspection_date'] = insp['inspection_date'] if insp['inspection_date'] else '---'
    insp['summary'] = insp["custom_fields"]["custom_field_70440"]["value"]  if insp["custom_fields"].get("custom_field_70440") else ''
    insp['album'] = insp["custom_fields"]["custom_field_79604"]["value"] if insp["custom_fields"].get("custom_field_79604") else ''
    insp['original'] = orig_insp
    insp['attachments'] = sorted(insp['attachments'], key=lambda att: att['name'])
    return insp

def item_date(item):
    value = ''
    if item.get('custom_fields') and item['custom_fields'].get("custom_field_70415"):
        value = item['custom_fields']['custom_field_70415']['value']
    try:
        date_obj = parse(value)
        value = date_obj.strftime('%Y-%m-%d')
    except:
        return None
        
    return value

#   def format_status(text)
#     if text.downcase == 'ready_for_review'
#       return 'Ready For Review'
#     else
#       return text.capitalize()
#     end
#   end
# end

def format_date(date_str):
    date_obj = parse(date_str)
    return date_obj.strftime('%Y-%m-%d')