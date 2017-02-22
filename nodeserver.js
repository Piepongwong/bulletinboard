let express = require('express');
let app = express()
let pg = require('pg')

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.urlencoded()); // to support URL-encoded bodies

let connectionString = 'postgres://' + process.env.POSTGRES_USERNAME + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

app.get('/addmessage', function(err, res) {
	res.render('addmessage')
})

app.get('/showmessages', function(err, res) {
	var client = new pg.Client(connectionString);
	client.connect(function (err) {
		if (err) throw err;
		client.query('SELECT * FROM messages', function(err, result) {
		messages = result.rows;
		client.end()
		res.render("showmessages", {messages})
		})
	})
})

app.post('/addmessagehandler', function(req, res) {
	let formTitle = req.body.title;
	let formBody = req.body.message;

	var client = new pg.Client(connectionString);
	client.connect(function (err) {
		if (err) throw err;
		client.query('INSERT INTO messages (title, body) VALUES (\'' + formTitle + '\',\'' + formBody + '\')', function(err, result) {
			if(err) throw err;
			else
			console.log("Message added");
			client.end();
		});
	});
	res.redirect('/showmessages')
})

var server = app.listen(3000, function() {
	var host = server.address().address;
	var post = server.address().port;
	console.log("Listing at http://%s:%s", host, post);
})

