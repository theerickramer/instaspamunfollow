var ejs = require('ejs');
var request = require('request');
var querystring = require('querystring');
var express = require('express');
var app = express();
app.set('view engine', 'ejs')
app.locals.client_id = process.env.INSTA_ID;
app.locals.client_secret = process.env.INSTA_SECRET;
app.locals.followsUrls = {};

app.get('/', function(req, res) {
	res.render('index')
})

app.get('/auth', function(req, res) {
	var access_token_request = {
		client_id: app.locals.client_id,
		client_secret: app.locals.client_secret,
		grant_type: 'authorization_code',
		redirect_uri: 'http://localhost:3000/auth',
		code: req.query.code
	}

	request({
		method: 'POST',
		url: 'https://api.instagram.com/oauth/access_token',
		body: querystring.stringify(access_token_request)
	}, function(error, response){
		app.locals.user = JSON.parse(response.body).user
		app.locals.accessToken = JSON.parse(response.body).access_token;
		res.render('welcome');
	})
})


app.get('/user/:id/following', function(req, res){
	app.locals.followsUrls.current = 'https://api.instagram.com/v1/users/' + req.params.id + '/follows?access_token=' + app.locals.accessToken;
	if (app.locals.followsUrls.next){
		request({
			method: 'GET',
			url: app.locals.followsUrls.next,
		}, function(error, response){
			var follows = JSON.parse(response.body);
			console.log(follows)
			
			app.locals.followsUrls.next = follows.pagination.next_url;
			res.render('follows', {follows: follows})
		})
	} else {
		request({
			method: 'GET',
			url: app.locals.followsUrls.current,
		}, function(error, response){
			var follows = JSON.parse(response.body);
			app.locals.followsUrls.next = follows.pagination.next_url;
			console.log(follows)
			res.render('follows', {follows: follows})
		})
	}
})

app.get('/user/:id/friends', function(req, res){
	res.render('friends')
})

var server = app.listen(3000, function() {
	var host = server.address().address
	var port = server.address().port

	console.log('server listening at http://%s:%s', host, port)
})