var express = require('express');
	app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , fs = require('fs')
  , _ = require('underscore');

// get port and host config
var config = JSON.parse(fs.readFileSync('config.json'));
var host = process.env.HOST || config.host;
var port = process.env.PORT || config.port;

// listen
server.listen(port, host);

app.use(express.static(__dirname + '/frontHand'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});




/**
* is user valid
*/
app.post("/socket/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = JSON.parse(postData);

		io.sockets.emit(cfg.emit, cfg.args);
		response.send(true);
	});
});

/**
* is user valid
*/
app.post("/isUserValid/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = JSON.parse(postData);

		getData(cfg, 'user', function(val){
			console.log('return user valid: ' + !val);
			response.send(!val)
		});
	});
});

/**
* insertUser API
*/
app.post("/insertUser/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var user = JSON.parse(postData);

		insertData(user, 'user', function(val){
			response.send(val)
		});
	});
});

/**
* insertCompany API
*/
app.post("/insertCompany/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var company = JSON.parse(postData);

		insertData(company, 'company', function(val){
			response.send(val);
		});
	});
});

/**
* addRoom API
*/
app.post("/addRoom/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var room = JSON.parse(postData);

		insertData(room, 'room', function(val){
			response.send(val);
		});
	});
});

/**
* addAction API
*/
app.post("/addAction/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var action = JSON.parse(postData);

		insertData(action, 'action', function(val){
			response.send(val);
		});
	});
});


/**
* getUser API
*/
app.post("/getUser/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var user = JSON.parse(postData);

		getData(user, 'user', function(userData){
			response.send(userData);
		});
	});
});

/**
* getRooms API
*/
app.post("/getRooms/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = JSON.parse(postData);

		getData(cfg, 'room', function(userData){
			response.send(userData);
		});
	});
});

/**
* getActions API
*/
app.post("/getActions/", function(request, response){

	var postData = '', data;
	var ObjectID = require('mongodb').ObjectID;

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = data = JSON.parse(postData);

		if (cfg.actions){
			_.each(cfg.actions, function(action, idx){
				cfg.actions[idx] = new ObjectID(action);
			});

			data = {
				'_id': {$in: cfg.actions}
			};			
		}

		console.log('actions array after manifulation', data)

		getData(data, 'action', function(userData){
			response.send(userData);
		});
	});
});


/**
* update action API
*/
app.post("/updateAction/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = JSON.parse(postData);

		updateData(cfg.find, cfg.set, 'action', function(data){
			response.send(data);
		});

	});
});

/**
* update room API
*/
app.post("/updateRoom/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = JSON.parse(postData);

		updateData(cfg.find, cfg.set, 'room');
		response.send(cfg);

	});
});

/**
* send email API
*/
app.post("/sendEmail/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = JSON.parse(postData);

		sendEmail(cfg, 
			function(){
				response.send(true);
			},
			function(){
				response.send(false);
			});

	});
});


/* get data */
function getData(cfg, collectionName, callback){

	console.log('*** getData ***');
	console.log('collectionName: ', collectionName);
	console.log('cfg: ', cfg);

	var ObjectID = require('mongodb').ObjectID;
	var mongo = require('mongodb');
	var host = '127.0.0.1';
	var port = mongo.Connection.DEFAULT_PORT;

	if (cfg._id  && _.isString(cfg._id)){
		cfg._id = new ObjectID(cfg._id);
	}

	console.log('mongo.Connection.DEFAULT_PORT: ' + mongo.Connection.DEFAULT_PORT);

	var db = new mongo.Db('actionitems', new mongo.Server(host, port, {}));
	
	// open db
	db.open(function(error){
		console.log('We are connected ' + host + ':' + port);

		db.collection(collectionName, function(error, collection){

			collection.find(cfg, function(error, cursor){
				cursor.toArray(function(error, dataRecievedArray){
					console.log('getData data recieved:', dataRecievedArray);
					if (dataRecievedArray && dataRecievedArray.length == 0){
						callback(false);
					} else {
						callback(dataRecievedArray);
					}
				});
			});

		});
	});
}

/**
* insert data
*/
function insertData(cfg, collectionName, callback){

	console.log('*** insert data ***');

	var mongo = require('mongodb');
	var host = '127.0.0.1';
	var port = mongo.Connection.DEFAULT_PORT;
	var db = new mongo.Db('actionitems', new mongo.Server(host, port, {}));

	db.open(function(error){
		console.log('We are connected ' + host + ':' + port);

		db.collection(collectionName, function(error, collection){
			collection.insert(cfg, {safe: true}, function(error, records){

				console.log('***************************records', records);
				console.log('data inserted: ', cfg, 'collection: ', collectionName);

				io.sockets.emit('dbChanged', { type: collectionName });

				callback(records);
			});
		});
	});
}


/* update data */
function updateData(cfg, set, collectionName, callback){

	

	console.log('*** getData ***');
	console.log('collectionName: ', collectionName);
	console.log('cfg: ', cfg);

	var ObjectID = require('mongodb').ObjectID;
	var mongo = require('mongodb');
	var host = '127.0.0.1';
	var port = mongo.Connection.DEFAULT_PORT;

	if (cfg._id && _.isString(cfg._id)){
		cfg._id = new ObjectID(cfg._id);
	}

	console.log('mongo.Connection.DEFAULT_PORT: ' + mongo.Connection.DEFAULT_PORT);

	var db = new mongo.Db('actionitems', new mongo.Server(host, port, {}));
	
	// open db
	db.open(function(error){
		console.log('We are connected ' + host + ':' + port);

		db.collection(collectionName, function(error, collection){
			// update !
			collection.update(cfg, { $set : set }, {}, function(){

				// find and return the document
				collection.find(cfg, function(error, cursor){
					cursor.toArray(function(error, dataRecievedArray){
						console.log('update data -  data recieved:', dataRecievedArray);
						if (dataRecievedArray && dataRecievedArray.length == 0){
							callback && callback(false);
						} else {
							callback && callback(dataRecievedArray[0]);
						}
					});
				});

			});

			

		});
	});
}



/**
* is company valid
*/
app.post("/isCompanyValid/", function(request, response){

	var postData = '';

	request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log('recieved post data chunk');
	});

	request.addListener("end", function(){
		console.log('recieved ALL post data: ', postData);
		var cfg = JSON.parse(postData);

		getData(cfg, 'company', function(val){
			console.log('return company valid: ' + !val);
			response.send(!val)
		});
	});
});


var emails = {
	newAction: {
		subject: "new action",
		text: "you have a new action waiting for you at action items"
	}
}

/**
	gmail account: actionitems2013@gmail.com  password: n5t5phxc
	sendEmail

	cfg: {
		email:
		type:
		name:
	}
*/

function sendEmail(cfg, successCB, errorCB){

	var nodemailer = require("nodemailer");

	var smtpTransport = nodemailer.createTransport("SMTP",{
	   service: "Gmail",
	   auth: {
	       user: "actionitems2013@gmail.com",
	       pass: "n5t5phxc"
	   }
	});

	smtpTransport.sendMail({
	   from: "action items <actionitems2013@gmail.com>", // sender address
	   to: cfg.name + " <" + cfg.email + ">", // comma separated list of receivers
	   subject: emails[cfg.type].subject, // Subject line
	   text: emails[cfg.type].text // plaintext body
	}, function(error, response){
	   if(error){
	       console.log(error);
	       errorCB && errorCB();
	   }else{
	       console.log("Message sent: " + response.message);
	       successCB && successCB();
	   }
	});

}







