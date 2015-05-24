//server initialization
var express = require('express'),
    app     = express(),
    route	= require('./server/routes'),
    config	= require('./server/config');

var io = require('socket.io').listen(app.listen(config.port, function() {
	console.log('connected to Ping chat server at port: ', config.port);
}));

config.init(app, __dirname);
route(app, io, __dirname);