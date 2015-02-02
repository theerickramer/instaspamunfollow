require('locus')
var ejs = require('ejs')
var request = require('request')
var querystring = require('querystring')
var fs = require('fs')
var express = require('express')
var app = express()
var user;
var accessToken; 
var client_id = process.env.INSTA_ID;
var client_secret = process.env.INSTA_SECRET

app.get('/', function(req, res) {
	fs.readFile('./views/index.html', 'utf8', function(err, data){
			res.send(ejs.render(data, {client_id : client_id}))
	})
})

app.get('/auth', function(req, res) {
	var access_token_request = {
		client_id: client_id,
		client_secret: client_secret,
		grant_type: 'authorization_code',
		redirect_uri: 'http://localhost:3000/auth',
		code: req.query.code
	}

	request({
		method: 'POST',
		url: 'https://api.instagram.com/oauth/access_token',
		body: querystring.stringify(access_token_request)
	}, function(error, response){
		user = JSON.parse(response.body)
		accessToken = user.access_token
		fs.readFile('./views/welcome.html', 'utf8', function(err, data){
			res.send(ejs.render(data, user))
		})
	})
})

var server = app.listen(3000, function() {
	var host = server.address().address
	var port = server.address().port

	console.log('server listening at http://%s:%s', host, port)
})