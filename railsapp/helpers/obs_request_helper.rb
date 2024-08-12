module ObsRequestHelper
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

  def obs_long_list(session, params, inspection_id)
    p params
    obs_list = obs_list_http(session, params)
    p 'OBS LONG LIST INSPECTION ID'
    p inspection_id
    if inspection_id
      obs_list.map! { |obs| simplify_observation(obs) }
      obs_list.select! { |obs| obs["inspection_id"] == inspection_id}
    end
    obs_id_list = []
    obs_list.each do |obs|
      obs_id_list << obs['id']
    end
    p obs_id_list
    threads = []
    obs_show_list = {}
    pdf_link_list = {}
    obs_resp_list = {}
    obs_id_list.each do |obs_id|
      threads << Thread.new { obs_show_list[obs_id] = simplify_observation(obs_show_http(session, obs_id)) }
      threads << Thread.new { pdf_link_list[obs_id] = obs_pdf_link_http(session, obs_id) }
      threads << Thread.new { obs_resp_list[obs_id] = obs_responses_http(session, obs_id) }
    end
    threads.each(&:join)
    obs_long_list = []
    obs_id_list.each do |obs_id|
      obs = obs_show_list[obs_id]
      obs['pdf_link'] = pdf_link_list[obs_id]
      obs['responses'] = obs_resp_list[obs_id]
      obs_long_list << obs
    end
    obs_long_list.sort_by! { |hsh| hsh["number"] }
    return obs_long_list
  end

  def obs_list_http(session, params)
    endpoint = '/rest/v1.0/observations/items'
    qs = "project_id=#{params[:project_id]}"
    resp = http_get(endpoint, qs, base_headers(session))
    p 'Received list response'
    # p resp
    resp.parsed_response.is_a?(Array) ? resp.parsed_response : []
  end

  def get_obs(session, obs_id)
    threads = []
    resp = {}
    threads << Thread.new { resp['main'] = obs_show_http(session, obs_id) }
    threads << Thread.new { resp['pdf_link'] = obs_pdf_link_http(session, obs_id) }
    threads << Thread.new { resp['responses'] = obs_responses_http(session, obs_id) }
    threads.each(&:join)
    p resp['main']
    obs = simplify_observation(resp['main'])
    obs['pdf_link'] = resp['pdf_link']
    obs['responses'] = resp['responses']
    return obs
  end

  def obs_show_http(session, obs_id)
    item = {}
    endpoint = "/rest/v1.0/observations/items/#{obs_id}"
    qs = "project_id=#{params[:project_id]}"
    while item.empty?
      resp = http_get(endpoint, qs, base_headers(session))
      item = resp.parsed_response
    end
    return item
  end

  def obs_pdf_link_http(session, obs_id)
    endpoint = "/rest/v1.0/observations/items/#{obs_id}/pdf"
    qs = "project_id=#{params[:project_id]}"
    resp = http_get(endpoint, qs, base_headers(session))
    return resp.parsed_response
  end

  def obs_responses_http(session, obs_id)
    endpoint = "/rest/v1.0/observations/items/#{obs_id}/response_logs"
    qs = "project_id=#{params[:project_id]}"
    resp = http_get(endpoint, qs, base_headers(session))
    return resp.parsed_response
  end

  def obs_types_http(session, params)
    endpoint = "/rest/v1.0/projects/#{params[:project_id]}/observation_types"
    resp = http_get(endpoint, '', base_headers(session))
    resp.parsed_response.is_a?(Array) ? resp.parsed_response : []
  end

  def obs_update_http(session, method, url, these_params)
    procore_token = JSON.parse(session['procore_token'])
    form_data = [['project_id', params[:project_id]]]
    observation = JSON.parse(these_params[:observation])
    observation.each {|key, val| form_data.push(["observation[#{key}]", val.to_s])}
    if these_params[:attachments]
      these_params[:attachments].keys.each {|key| form_data.push(['attachments[]', these_params[:attachments][key], filename: these_params[:attachments][key].original_filename]) }
    end
    # ## Net http
    url = URI(url)
    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true
    if method == 'PATCH'
      request = Net::HTTP::Patch.new(url)
    else # if post
      request = Net::HTTP::Post.new(url)
    end
    request["Authorization"] = "Bearer #{procore_token['access_token']}"
    request['Procore-Company-Id'] = ENV['COMPANY_ID']
    request.set_form form_data, 'multipart/form-data'
    p form_data
    response = https.request(request)
    return response.read_body
  end

end
