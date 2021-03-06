define(['jquery', 'events'], 
function($, events) {

	if (location.href.indexOf('heroku') != -1)
		var host = "http://actionitems.herokuapp.com";
	else
		var host = "http://localhost:1337";

	var socket = Backbone.Router.extend({

		initialize: function(){

			$(document).ready(function(){

				var socket = io.connect(host);
				console.log('socket active');

				socket.on('addRoom', function (data) {
					events.trigger('onAddRoom', data);
				});

				socket.on('updateRoomName', function(data){
					console.log('updateRoomName', data);
					events.trigger('onUpdateRoomName', data);
				});

				socket.on('addAction', function(data){
					console.log('onAddAction', data);
					events.trigger('onAddAction', data);
				});

				socket.on('updateAction', function(data){
					console.log('onUpdateAction', data);
					events.trigger('onUpdateAction', data);
				});

				socket.on('deleteAction', function(data){
					console.log('onDeleteAction', data);
					events.trigger('onDeleteAction', data);
				});

				socket.on('updateUsers', function(data){
					console.log('onUpdateUsers', data);
					events.trigger('onUpdateUsers', data);
				});

				socket.on('updateActionsOrder', function(data){
					console.log('onUpdateActionsOrder', data);
					events.trigger('onUpdateActionsOrder', data);
				});

			});
		}

	});	

	return new socket();
});