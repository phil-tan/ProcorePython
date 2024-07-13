class PhotosController < ApplicationController

  def albums
    procore_token = JSON.parse(session['procore_token'])
    resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.0/image_categories?project_id=#{params[:project_id]}",
                          headers: { 'Authorization' => "Bearer #{procore_token['access_token']}",
                          'Procore-Company-Id' => ENV['COMPANY_ID']  })
    @albums = resp.parsed_response ? resp.parsed_response : {}
    render json: @albums
  end

  def album_photos
    procore_token = JSON.parse(session['procore_token'])
    query = {
      'project_id' => params[:project_id],
      'image_category_id' => params[:album_id],
      'page' => '1',
      'per_page' => '500',
      'sort' => 'taken_at'
    }
    headers = { 'Authorization' => "Bearer #{procore_token['access_token']}",
                'Procore-Company-Id' => ENV['COMPANY_ID']  }

    resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.0/images?",
                          query: query,
                          headers: headers)
    @photos = resp.parsed_response ? resp.parsed_response : {}
    render json: @photos
  end
end
