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
  data = RestClient.post("#{baseUrl}?invitee_email=#{email}&sender=#{name}", {:url => confUrl})
end

get '/sendToPhone' do
  baseUrl = 'http://tokphone.tokbox.com:9999/tokphone/connect'
  did1 = params[:did1]
  did2 = URI.escape(params[:did2])
  did3 = params[:did3] ? URI.escape(params[:did3]) : ''
  data = RestClient.post("#{baseUrl}?did1=#{did1}&did2=#{did2}&did3=#{did3}")
end
