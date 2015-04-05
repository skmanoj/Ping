var express = require('express'),
	app     = express(),
	route	= require('./routes'),
	config	= require('./config');

var io = require('socket.io').listen(app.listen(config.port, function() {
	console.log('connected to Ping chat server at port: ', config.port);
}));

config.init(app);
route(app, io);