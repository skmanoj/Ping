var serverio = require('./serverio');

module.exports = function(app, io) {

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/client/views/home.html');
	});

	app.get('/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));

		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	app.get('/chat/:id', function(req,res){
		res.sendFile(__dirname + '/client/views/chat.html');
	});

	serverio(io);

	/*
	 * error handling
	 *
	*/
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).sendFile(__dirname + '/client/views/errors.html');

	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).sendFile(__dirname + '/client/views/errors.html');

	});
}