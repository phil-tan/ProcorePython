module InspRequestHelper
  def simplify_inspection(orig_insp)
    insp = orig_insp.dup
    insp['inspection_date'] = insp['inspection_date'] ? insp['inspection_date'] : '---'
    insp['summary'] = insp["custom_fields"]["custom_field_70440"] ? insp["custom_fields"]["custom_field_70440"]["value"]  : ''
    insp['album'] = insp["custom_fields"]["custom_field_79604"] ? insp["custom_fields"]["custom_field_79604"]["value"] : ''
    insp['original'] = orig_insp
    insp['attachments'] = insp['attachments'].sort_by { |att| att['name'] }
    return insp
  end

  def insp_list_http(session, params)
    resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.1/projects/#{params[:project_id]}/checklist/lists",
                          headers: base_headers(session))
    @checklists = resp.parsed_response.is_a?(Array) ? resp.parsed_response : []
    @checklists.map! {|cl| simplify_inspection(cl) }
    threads = []
    @checklists.each_with_index do |_, i|
      threads << Thread.new {@checklists[i]["checklist_items"] = list_checklist_items_http(@checklists[i]["id"]) }
    end
    threads.each(&:join)
    @checklists = @checklists.sort_by { |cl| cl["inspection_date"] }.reverse()
    return resp.parsed_response.is_a?(Array) ? resp.parsed_response : []
  end

  def list_checklist_items_http(insp_id)
    url = "#{ENV['BASE_URL']}/rest/v1.0/projects/#{params[:project_id]}/checklist/list_items?filters[list_id]=#{insp_id}"
    headers = base_headers(session)
    resp = HTTParty.get(url, headers: headers)
    return resp.parsed_response
  end

  def insp_show_http(session, params)
    resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.1/projects/#{params[:project_id]}/checklist/lists/#{params[:insp_id]}",
    headers: base_headers(session))
    checklist = resp.parsed_response ? resp.parsed_response : {}
    checklist = simplify_inspection(checklist)
    threads = []
    threads << Thread.new {checklist["checklist_items"] = list_checklist_items_http(checklist["id"]) }
    threads << Thread.new {checklist["photos"] = photos_http(session, params, checklist) }
    threads << Thread.new {checklist["observations"] = obs_long_list(session, params, checklist["id"])}
    threads.each(&:join)
    return checklist
  end

  def insp_update_http(session, method, url, these_params)
    "printing these parameters"
    p these_params
    procore_token = JSON.parse(session['procore_token'])
    form_data = [['project_id', params[:project_id]]]
    inspection = JSON.parse(these_params[:list])
    inspection.each {|key, val| form_data.push(["list[#{key}]", val.to_s])}
    # ## Net http
    url = URI(url)
    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true
    if method == 'PATCH'
      request = Net::HTTP::Patch.new(url)
    else # if creating
      request = Net::HTTP::Post.new(url)
    end
    request["Authorization"] = "Bearer #{procore_token['access_token']}"
    request['Procore-Company-Id'] = ENV['COMPANY_ID']
    request.set_form form_data, 'multipart/form-data'
    response = https.request(request)
    return response.read_body
  end

  def insp_post_attachments(session, method, url, these_params)
    p "posting attachments"
    procore_token = JSON.parse(session['procore_token'])
    form_data = []
    if these_params[:attachments]
      these_params[:attachments].keys.each do |key|
        form_data = []
        form_data.push(['attachment', these_params[:attachments][key], filename: these_params[:attachments][key].original_filename])
        p form_data
        # ## Net http
        url = URI(url)
        https = Net::HTTP.new(url.host, url.port)
        https.use_ssl = true
        request = Net::HTTP::Post.new(url)
        request["Authorization"] = "Bearer #{procore_token['access_token']}"
        request['Procore-Company-Id'] = ENV['COMPANY_ID']
        request.set_form form_data, 'multipart/form-data'
        response = https.request(request)
        p response.code
      # return response.read_body
      end
    end
  end

  def photos_http(session, params, checklist)
    # albums
    resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.0/image_categories?project_id=#{params[:project_id]}", headers: base_headers(session))
    albums = resp.parsed_response ? resp.parsed_response : []
    # find album id
    this_album = albums.find {|album| album["name"] == checklist["album"] }
    #photos for this album
    photos = []
    if this_album
      query = {
        'project_id' => params[:project_id],
        'image_category_id' => this_album["id"],
        'page' => '1',
        'per_page' => '1000',
        'sort' => 'taken_at'
      }
      resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.0/images?",
                            query: query,
                            headers: base_headers(session))
      photos = resp.parsed_response ? resp.parsed_response : []
      photos = photos.select {|photo| photo["description"].include?('[Figure')}
      photos.each do |photo|
        figure_string = photo["description"].match(/\[Figure.*\]/)[0]
        fig_num = figure_string.match(/\s.*\]/)[0][1..-2]
        photo['order'] = fig_num
        photo['caption'] = photo['description'].gsub(/\[Figure.*\]/, '')
      end
      photos.sort_by! { |photo| photo['order'] }
    end
    return photos
  end

  def photo_update_http(session, photo_id)
    procore_token = JSON.parse(session['procore_token'])
    url = "/rest/v1.0/images/#{photo_id}"
    resp = HTTParty.patch(url, headers: base_headers(session), body: body.to_json)
    return resp.parsed_response
  end

end
