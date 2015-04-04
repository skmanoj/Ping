var express = require('express');

module.exports = {
	port: process.env.PORT || 3000,
	init: function(app) {
		app.use('/css', express.static(__dirname + '/public/lib/bootstrap/dist/css'));
		app.use('/localcss', express.static(__dirname + '/client/views/localcss'));
		app.use('/img', express.static(__dirname + '/public/img'));
		app.use('/bootstrapjs', express.static(__dirname + '/public/lib/bootstrap/dist/js'));
		app.use('/jqueryjs', express.static(__dirname + '/public/lib/jquery/dist'));
	}
}