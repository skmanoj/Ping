//configurations on server side
var express = require('express'),
	morgan  = require('morgan');

module.exports = {
	port: process.env.PORT || 3000,
	init: function(app, rootDir) {
		app.use('/css', express.static(rootDir + '/public/lib/bootstrap/dist/css'));
		app.use('/localcss', express.static(rootDir + '/client/views/localcss'));
		app.use('/localjs', express.static(rootDir + '/client/js'));
		app.use('/img', express.static(rootDir + '/public/img'));
		app.use('/lib', express.static(rootDir + '/public/lib'));
		app.use('/bootstrapjs', express.static(rootDir + '/public/lib/bootstrap/dist/js'));
		app.use('/jqueryjs', express.static(rootDir + '/public/lib/jquery/dist'));

		if (process.env.NODE_ENV === 'production') {

		} else {
			//logging in case of non production environments
			app.use(morgan('dev'));
		}
	}
}