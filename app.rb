require 'sinatra'
require 'rest_client'
require 'uri'

get '/' do
  erb :index
end

get '/invite' do
  baseUrl = 'http://tokphone.tokbox.com:9999/tokphone/invite'
  confUrl = params[:url]
  email = URI.escape(params[:email])
  name =  URI.escape(params[:name])
  data = RestClient.post("#{baseUrl}?url=#{URI.escape(confUrl)}&invitee_email=#{email}&sender=#{name}", {:url => confUrl})
end