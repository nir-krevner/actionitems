define(['jquery', 'underscore', 'backbone', 'joinModulView'], 
	function($, _, Backbone, joinModulView) {

	// var localhost = "217.132.95.179";
	var localhost = "localhost";

    var db = {


    	socket: function(cfg){

			$.ajax({
				url: 'http://' + localhost + ':1337/socket/',
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
				url: 'http://' + localhost + ':1337/isUserValid/',
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
				url: 'http://' + localhost + ':1337/insertUser/',
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
				url: 'http://' + localhost + ':1337/insertCompany/',
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
				url: 'http://' + localhost + ':1337/addRoom/',
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
				url: 'http://' + localhost + ':1337/addAction/',
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
				url: 'http://' + localhost + ':1337/getUser/',
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
				url: 'http://' + localhost + ':1337/updateRoom/',
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
				url: 'http://' + localhost + ':1337/updateAction/',
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
				url: 'http://' + localhost + ':1337/sendEmail/',
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
				url: 'http://' + localhost + ':1337/getRooms/',
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
				url: 'http://' + localhost + ':1337/getActions/',
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
				url: 'http://' + localhost + ':1337/isCompanyValid/',
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