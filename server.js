var express = require('express'),
	port    = process.env.PORT || 3000,
	app     = express();

app.get('/', function(req, res) {
	res.send('Hello IRC');
})

app.listen(port, function() {
	console.log('connected to Ping chat server at port: ', port);
})