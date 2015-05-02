var cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  	
  	// Fork workers.
  	for (var i = 0; i < numCPUs; i++) {
    	cluster.fork();
  	}

  	cluster.on('online', function(worker) {
  		console.log("The worker "+worker.process.pid+ "responded after it was forked");
	});

  	cluster.on('exit', function(worker, code, signal) {
    	console.log('worker ' + worker.process.pid + ' died');
  	});
} else {

	//this is run by worker's which are forked
	var express = require('express'),
	    app     = express(),
	    route	= require('./routes'),
	    config	= require('./config');

	//console.log('I am worker #' + cluster.worker.id);

	var io = require('socket.io').listen(app.listen(config.port, function() {
		console.log('connected to Ping chat server at port: ', config.port);
	}));

	config.init(app);
	route(app, io);
}