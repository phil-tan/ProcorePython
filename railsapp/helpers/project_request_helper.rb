module ProjectRequestHelper
  def base_headers(session)
    procore_token = JSON.parse(session['procore_token'])
    return { 'Authorization' => "Bearer #{procore_token['access_token']}", 'Procore-Company-Id' => ENV['COMPANY_ID']  }
  end

  def http_get(endpoint, query, headers)
    url = "#{ENV['BASE_URL']}#{endpoint}?#{query}"
    p "HTTP GETTING #{url}"
    return HTTParty.get(url, headers: headers)
  end

  def assignees_list_http(session, params)
    endpoint = '/rest/v1.0/observations/assignees'
    qs = "project_id=#{params[:project_id]}}"
    resp = http_get(endpoint, qs, base_headers(session))
    resp.parsed_response.is_a?(Array) ? resp.parsed_response : []
  end

  def trades_http(session, params)
    endpoint = "/rest/v1.0/companies/#{ENV['COMPANY_ID']}/trades"
    resp = http_get(endpoint, '', base_headers(session))
    resp.parsed_response.is_a?(Array) ? resp.parsed_response : []
  end

  def locations_http(session, params)
    endpoint = "/rest/v1.0/projects/#{params[:project_id]}/locations"
    resp = http_get(endpoint, '', base_headers(session))
    resp.parsed_response.is_a?(Array) ? resp.parsed_response : []
  end

  def project_http(session, params)
    endpoint = '/rest/v1.1/projects'
    qs = "company_id=#{ENV['COMPANY_ID']}&filters[id]=#{params[:project_id]}&view=normal"
    resp = http_get(endpoint, qs, base_headers(session))
    p 'Received Project List'
    hashes = JSON.parse(resp.parsed_response.to_json)
    return hashes[0]
  end
end
