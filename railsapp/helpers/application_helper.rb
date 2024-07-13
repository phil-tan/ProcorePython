require 'date'

module ApplicationHelper

  def simplify_observation(item)
    new_item = {}
    new_item['id'] = item['id']
    new_item['number'] = item['number'].to_f
    new_item['item_date'] = item_date(item)
    # new_item['item_date'] = item['created_at']
    new_item['name'] = item['name']
    new_item['description'] = item['description_rich_text']
    new_item['status'] = item['status'] ? item['status'].capitalize() : nil
    new_item['trade'] = item['trade'] ? item['trade']['name'] : nil
    new_item['action_by'] = item['assignee'] && item['assignee']['vendor'] ? item['assignee']['vendor']['name'] : nil
    new_item['assignee'] = item['assignee'] ? item['assignee'] : nil
    new_item['attachments'] = item['attachments']
    new_item['created_by'] = item['created_by']['name']
    new_item['type'] = item['type']['name']
    # new_item['updated_at'] = format_date(item.updated_at)
    new_item['original'] = item
    new_item['inspection_id'] = item['origin'] && item['origin']['payload'] ? item['origin']['payload']['checklist_list_id'] : ''
    new_item['location'] = item['location'] ? item['location']['name'] : nil
    new_item['priority'] = item['priority'] ? item['priority'] : nil
    new_item['loading'] = false
    return new_item
  end

  def simplify_inspection(orig_insp)

    # resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.1/projects?company_id=#{ENV['COMPANY_ID']}&filters[id]=#{params[:project_id]}&view=normal",
    # headers: { 'Authorization' => "Bearer #{procore_token['access_token']}",
    # 'Procore-Company-Id' => ENV['COMPANY_ID']  })
    # p 'Received Filtered Project List'
    # hashes = JSON.parse(resp.parsed_response.to_json)
    # project_name = hashes[0]['name']

    insp = orig_insp.dup
    insp['inspection_date'] = insp['inspection_date'] ? insp['inspection_date'] : '---'
    insp['summary'] = insp["custom_fields"]["custom_field_70440"] ? insp["custom_fields"]["custom_field_70440"]["value"]  : ''
    insp['album'] = insp["custom_fields"]["custom_field_79604"] ? insp["custom_fields"]["custom_field_79604"]["value"] : ''
    insp['original'] = orig_insp
    insp['attachments'] = insp['attachments'].sort_by { |att| att['name'] }
    return insp
  end

  def item_date(item)
    value = ''
    if item['custom_fields'] && item['custom_fields']["custom_field_#{ENV['ITEM_DATE_CUSTOM_FIELD_ID']}"]
      value = item['custom_fields']["custom_field_#{ENV['ITEM_DATE_CUSTOM_FIELD_ID']}"]['value']
    end
    return format_date(value)
  end

  def format_date(d)
    begin
      d = Date.parse(d)
      return d.strftime('%Y-%m-%d')
    rescue
      return '---'
    end
  end

  def format_status(text)
    if text.downcase == 'ready_for_review'
      return 'Ready For Review'
    else
      return text.capitalize()
    end
  end
end
