require 'uri'
require 'net/http'
require 'rest-client'
require 'json'

class InspectionsController < ApplicationController
  rescue_from Procore::Error do |e|
    redirect_to login_path, danger: "#{e.class}: #{e.message}"
  end

  def list
    @checklists = helpers.insp_list_http(session, params)
    render json: @checklists
  end

  def show
    # inspection
    @checklist = helpers.insp_show_http(session, params)
    render json: @checklist
  end

  def update
    p "update route"
    update_url = "#{ENV['BASE_URL']}/rest/v1.0/projects/#{params[:project_id]}/checklist/lists/#{params[:insp_id]}"
    insp_resp = helpers.insp_update_http(session, 'PATCH', update_url, upload_params())
    att_url = "#{ENV['BASE_URL']}/rest/v1.0/projects/#{params[:project_id]}/checklist/lists/#{params[:insp_id]}/attachments"
    att_resp = helpers.insp_post_attachments(session, 'POST', att_url, upload_params())
    @checklist = helpers.insp_show_http(session, params)
    render json: @checklist
  end

  def checklist_obs
    p "getting observations for checklist"
    observations = helpers.obs_long_list(session, params, params[:insp_id].to_i)
    render json: observations
  end

  def upload_params
    params.require(:body).permit!
  end
end
