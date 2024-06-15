class ProxyController < ApplicationController

  


  def get

  end

  def patch
  end

  def post
  end

  def delete
  end

  private

  def http_procore_request(method, url, these_params)
    headers = { 'Authorization' => "Bearer #{procore_token['access_token']}", 'Procore-Company-Id' => ENV['COMPANY_ID'] }
    case method
    when 'GET'
      resp = HTTParty.post(url, headers: headers)
      resp.parsed_response
    else
      p 'not a valid request'
    end
  end
end
