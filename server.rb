require 'sinatra'
require 'sinatra/reloader'
require 'httparty'
require 'pry'

set :port, 3000

get '/' do
	File.read('./views/index.html')
end

get '/auth' do 
	access = HTTParty.post('https://api.instagram.com/oauth/access_token',
		body: { 
			client_id: ENV['INSTA_ID'], 
			client_secret: ENV['INSTA_SECRET'], 
			grant_type: 'authorization_code',  
			redirect_uri: 'http://localhost:3000/auth', 
			code: params["code"] 
		})

	binding.pry
	File.read('./access.html')
end

get '/unfollowed' do
	File.read('./unfollowed.html')
end