define(['jquery', 'underscore', 'backbone', 'joinModulView'], 
	function($, _, Backbone, joinModulView) {

	var localhost = "peaceful-journey-3521.herokuapp.com";
	// var localhost = "localhost";
	// var port = ':1337';
	var port = '';

    var db = {


    	socket: function(cfg){

			$.ajax({
				url: 'http://' + localhost + port + '/socket/',
				type: "post",
				data: JSON.stringify(cfg),
				cache: false,
				timeout: 5000,
				success: function(){},
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

    	isUserValid: function(user, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/isUserValid/',
				type: "post",
				data: JSON.stringify(user),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

    	insertUser: function(user, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/insertUser/',
				type: "post",
				data: JSON.stringify(user),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

    	insertCompany: function(company, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/insertCompany/',
				type: "post",
				data: JSON.stringify(company),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

    	addRoom: function(room, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/addRoom/',
				type: "post",
				data: JSON.stringify(room),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

    	addAction: function(action, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/addAction/',
				type: "post",
				data: JSON.stringify(action),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

		getUser: function(user, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/getUser/',
				type: "post",
				data: JSON.stringify(user),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

		updateRoom: function(cfg, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/updateRoom/',
				type: "post",
				data: JSON.stringify(cfg),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

		updateAction: function(cfg, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/updateAction/',
				type: "post",
				data: JSON.stringify(cfg),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

		sendEmail: function(cfg, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/sendEmail/',
				type: "post",
				data: JSON.stringify(cfg),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

		getRooms: function(rooms, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/getRooms/',
				type: "post",
				data: JSON.stringify(rooms),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

		getActions: function(actionsArray, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/getActions/',
				type: "post",
				data: JSON.stringify(actionsArray),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});

		},

		isCompanyValid: function(cfg, success, error){

			$.ajax({
				url: 'http://' + localhost + port + '/isCompanyValid/',
				type: "post",
				data: JSON.stringify(cfg),
				cache: false,
				timeout: 5000,
				success: success,
				error: function(jqXHR, textStatus, errorThrown) {
					alert('error ' + textStatus + " " + errorThrown);
				}
			});
		}

    };

    return db;

});