var mongo = require('mongodb');
var host = '127.0.0.1';
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db('nodejs-introduction', new mongo.Server(host, port, {}));
db.open(function(error){
	console.log('We are connected ' + host + ':' + port);

	db.collection('user', function(error, collection){

		collection.insert({
			id: "1",
			name: "nir",
			mail: "nir@gmail.com"
		}, function(){
			console.log('nir inserted');
		});

		collection.insert({
			id: "2",
			name: "karen",
			mail: "karen@gmail.com"
		}, function(){
			console.log('karen inserted');
		});

	})


});