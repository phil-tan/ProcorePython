require 'uri'
require 'net/http'
require 'rest-client'
require 'json'

class PagesController < ApplicationController
  rescue_from Procore::Error do |e|
    redirect_to login_path, danger: "#{e.class}: #{e.message}"
  end

  def home
    client.refresh
    procore_token = JSON.parse(session['procore_token'])
    resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.1/projects?company_id=#{ENV['COMPANY_ID']}&page=1&per_page=300&filters[by_status]=Active",
                        headers: { 'Authorization' => "Bearer #{procore_token['access_token']}",
                        'Procore-Company-Id' => ENV['COMPANY_ID']  })
    p 'Received Project List'
    if resp.parsed_response.is_a?(Array)
      hashes = JSON.parse(resp.parsed_response.to_json)
      @projects = hashes.sort_by { |hsh| hsh["display_name"] }
      if params[:query].present?
        @projects = @projects.select { |project| project["display_name"].downcase.include? params[:query].downcase }
      end
    else
      @projects = []
    end
  end

  def project
    client.refresh
    procore_token = JSON.parse(session['procore_token'])
    resp = HTTParty.get("#{ENV['BASE_URL']}/rest/v1.1/projects?company_id=#{ENV['COMPANY_ID']}&page=1&per_page=300&filters[by_status]=Active",
                        headers: { 'Authorization' => "Bearer #{procore_token['access_token']}",
                        'Procore-Company-Id' => ENV['COMPANY_ID']  })
    p 'Received Project List'
    @project_id = params[:id]
    if resp.parsed_response.is_a?(Array)
      @project = resp.parsed_response.find {|project| project['id'].to_s == @project_id}
    else
      @project = {}
    end
  end

  def procore_app
    procore_token = JSON.parse(session['procore_token'])
    expires_at = procore_token['expires_at']
    @expires_in = expires_at - Time.now.to_i
    p @expires_in
    if @expires_in < 900
      client.refresh
      p 'refreshing token'
    end
    threads = []
    threads << Thread.new { @project = helpers.project_http(session, params) }
    threads << Thread.new { @locations = helpers.locations_http(session, params) }
    threads << Thread.new { @trades = helpers.trades_http(session, params) }
    threads << Thread.new { @assignees = helpers.assignees_list_http(session, params) }
    threads << Thread.new { @obstypes = helpers.obs_types_http(session, params) }
    threads.each(&:join)
    @item_date_field_id = ENV['ITEM_DATE_CUSTOM_FIELD_ID']
  end
end
