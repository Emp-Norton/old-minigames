const express = require('express');
// const mongodb = require('mongodb');
const bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
var db;


MongoClient.connect("mongodb://localhost:27017/checkout", function(err, data){
	if (err) console.log(err);
	db = data;
	console.log('connected to mongo');
});


const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

	
app.post('/submit', (req, res) => {
	db.collection('users').insertOne(req.body);
});

app.get('/users', (req, res) => {
  db.collection('users').find({}, function(err, data){
		if (err) console.log(err);
		data.toArray(function(err, results){
			if (err) console.log(err);
			res.json(results);
		})
	});

})

app.listen(3000, () => console.log('listening on 3000'));

