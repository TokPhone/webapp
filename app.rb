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
  p confUrl
  data = RestClient.post("#{baseUrl}?invitee_email=#{email}&sender=#{name}", {:url => confUrl})
end