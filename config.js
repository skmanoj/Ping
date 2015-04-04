var express = require('express'),
	morgan  = require('morgan');

module.exports = {
	port: process.env.PORT || 3000,
	init: function(app) {
		app.use('/css', express.static(__dirname + '/public/lib/bootstrap/dist/css'));
		app.use('/localcss', express.static(__dirname + '/client/views/localcss'));
		app.use('/img', express.static(__dirname + '/public/img'));
		app.use('/bootstrapjs', express.static(__dirname + '/public/lib/bootstrap/dist/js'));
		app.use('/jqueryjs', express.static(__dirname + '/public/lib/jquery/dist'));

		if (process.env.NODE_ENV === 'production') {

		} else {
			//logging in case of non production environments
			app.use(morgan('dev'));
		}
	}
}