var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  	
  	// Fork workers.
  	for (var i = 0; i < numCPUs; i++) {
    	cluster.fork();
  	}

  	cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  	});
} else {
	var express = require('express'),
	    app     = express(),
	    route	= require('./routes'),
	    config	= require('./config');

	var io = require('socket.io').listen(app.listen(config.port, function() {
	console.log('connected to Ping chat server at port: ', config.port);
	}));

	config.init(app);
	route(app, io);
}