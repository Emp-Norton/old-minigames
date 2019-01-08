const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/checkout", function(err, data){
	if (err) console.log(err);
	console.log('connected to mongo');
});

