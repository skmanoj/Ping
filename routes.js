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

		// Render the chant.html view
		//res.sendFile(__dirname + '/client/views/chat.html');
	});
}