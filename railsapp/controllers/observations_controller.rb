require 'uri'
require 'net/http'
require 'rest-client'
require 'json'
require 'httparty'
require 'http/form_data'


class ObservationsController < ApplicationController
  rescue_from Procore::Error do |e|
    redirect_to login_path, danger: "#{e.class}: #{e.message}"
  end

  def open_img
    @image_path = "#{params[:image_path]}?#{params[:sig]}"
  end

  # API routes

  def all_obs
    observations = helpers.obs_long_list(session, params, nil)
    render json: observations
  end

  def show
    observation = get_obs(session, params[:id])
    render json: observation
  end

  def edit
    url = "#{ENV['BASE_URL']}/rest/v1.0/observations/items/#{params[:id]}?project_id=#{params[:project_id]}"
    resp = helpers.obs_update_http(session, 'PATCH', url, upload_params())
    obs = helpers.get_obs(session, params[:id])
    #write code to check that item updated
    render json: obs
  end

  def create
    url = "#{ENV['BASE_URL']}/rest/v1.0/observations/items?project_id=#{params[:project_id]}}"
    resp = helpers.obs_update_http(session, 'POST', url, upload_params())
    p resp
    obs_id = JSON.parse(resp)["id"]
    obs = helpers.get_obs(session, obs_id)
    render json: obs
  end

  def delete
    url = "#{ENV['BASE_URL']}/rest/v1.0/projects/#{params[:project_id]}/observations/items/#{params[:id]}"
    resp = HTTParty.delete(url, headers: helpers.base_headers(session))
    render json: resp.code
  end

  private

  def upload_params
    params.require(:observation).permit!
  end

end
