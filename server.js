var express = require('express'),
	app     = express(),
	io		= require('socket.io'),
	route	= require('./routes'),
	config	= require('./config');

config.init(app);
route(app, io);


io.listen(app.listen(config.port, function() {
	console.log('connected to Ping chat server at port: ', config.port);
}));