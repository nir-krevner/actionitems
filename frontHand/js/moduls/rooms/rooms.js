define([
	'jquery', 
	'cookie', 
	'underscore', 
	'backbone', 
	'db',
	'mustache',
	'loginModul',
	'events',
	'initMenuModulView', 
	'watchRoom',
	'watchMyRoom',
	'text!moduls/rooms/template.html', 
	'css!moduls/rooms/rooms'
], 
function($, dontCare, _, Backbone, db, Mustache, loginModul, events, initMenuModulView, watchRoom, watchMyRoom, template) {

	var rooms = Backbone.View.extend({

		el: "#rooms",

		initialize: function() {
			this.getRoomsData();
		},

		bindEvents: function(){
			this.$('#addRoom').click(_.bind(function(){this.addRoom();}, this));
			this.$('.singleRoom').click(_.bind(function(e){this.watchRoom(e);}, this));
			this.$('.myRoom').click(_.bind(function(e){this.watchMyRoom(e);}, this));

			events.on('onAddRoom', _.bind(function(data){
				console.log('onAddRoom', data);
				this.onAddRoom(data);
			}, this));

			events.on('onUpdateRoomName', _.bind(function(data){
				console.log('onUpdateRoomName', data);
				this.onUpdateRoomName(data);
			}, this));

		},

		addRoom: function(){
			db.addRoom({
				companyId: JSON.parse(loginModul.getUser()).companyId,
				name: 'new room'
			}, function(records){

				if (records && records[0]){
					db.socket({
						emit: 'addRoom',
						args: {
							roomData: records[0]
						}
					});
				} else {
					console.error('no records recieved on add room');
				}

			});
			// reload will trigger by socket
		},

		onAddRoom: function(data){

			if (data.roomData.companyId == JSON.parse(loginModul.getUser()).companyId){
				var roomTemplate = '<div class="room" roomId="{{_id}}"><div class="roomTitle">{{name}}</div></div>';
				var $new_room = $(Mustache.render(roomTemplate, data.roomData));
				$new_room.click(_.bind(function(e){this.watchRoom(e);}, this));
				$('.roomCollection').append($new_room);
			}
		},

		getRoomsData: function(){

			console.log('loginModul.getUser(): ' + loginModul.getUser());
			// get rooms from db
			db.getRooms({
				companyId: JSON.parse(loginModul.getUser()).companyId
			}, _.bind(function(rooms){
				// render rooms
				this.render(rooms);
				this.bindEvents();
				events.trigger('setStageHeight');
			}, this));
		},

		render: function(rooms) {
			console.log('rooms - render', rooms);

			this.$el.append(Mustache.render(template, {
				rooms: rooms
			}));
		},

		watchRoom: function(event){
			this.$('.room').removeClass('selected');
			var $ele = $(event.currentTarget);
			$ele.addClass('selected');

			var room_id = $ele.attr('roomId');
			console.log('watch room', room_id);
			this.activeRoom && this.activeRoom.dispose();
			this.activeRoom = new watchRoom({_id: room_id, $parent: $('#items')});
		},

		watchMyRoom: function(event){
			this.$('.room').removeClass('selected');
			var $ele = $(event.currentTarget);
			$ele.addClass('selected');

			this.activeRoom && this.activeRoom.dispose();
			this.activeRoom = new watchMyRoom({_id: 'myroom' + JSON.parse(loginModul.getUser())._id, $parent: $('#items')});
		},

		onUpdateRoomName: function(cfg){
			// update room name in rooms collection 
			$('div[roomid=' + cfg._id + '] .roomTitle').text(cfg.roomName);
		},

		dispose: function(){
			this.$('#addRoom').unbind('click');
			this.$('.myRoom').unbind('click');
			this.$('.singleRoom').unbind('click');
			events.off('onAddRoom');
			events.off('onUpdateRoomName');
		}

	});	

	return rooms;
});