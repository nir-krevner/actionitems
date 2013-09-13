define([
	'jquery', 
	'cookie', 
	'underscore', 
	'backbone', 
	'db',
	'mustache',
	'dialog',
	'loginModul',
	'events',
	'actionItemsCollection',
	'stageUsersView',
	'initMenuModulView', 
	'text!moduls/watchRoom/template.html', 
	'css!moduls/watchRoom/watchRoom'
], 
function($, dontCare, _, Backbone, db, Mustache, dialog, loginModul, events, actionItemsCollection, stageUsersView, initMenuModulView, template) {

	var watchRoom = Backbone.View.extend({

		id: "actionitems",

		initialize: function(cfg) {
			this.cfg = cfg;

			events.trigger('setMenuButton', {
				set: 'enabled',
				id: 'addActionbtn'
			});

			events.trigger('setMenuButton', {
				set: 'enabled',
				id: 'editRoombtn'
			});
			
			events.trigger('setMenuButton', {
				set: 'enabled',
				id: 'zoomBtn'
			});

			events.trigger('setMenuButton', {
				set: 'enabled',
				id: 'compressBtn'
			});

			this.getRoomData();
		},

		bindEvents: function(){

			events.on('addAction', _.bind(function(){this.addAction()}, this));
			events.on('editRoom', _.bind(function(){this.roomName()}, this));
			events.on('onUpdateRoomName', _.bind(function(data){
				if (data._id == this.roomData._id){
					this.roomData.name = data.roomName;
				}
			}, this));

			events.on('onAddAction', _.bind(function(cfg){
				this.onAddAction(cfg);
			}, this));

		},

		roomName: function(){
			this.dialog = new dialog({
				type: 'updateRoomName',
				args: {
					oldRoomName: this.roomData.name
				},
				onClose: function(){},
				onSave: _.bind(function(data){
					this.updateRoomName(data);
				}, this)
			});
		},

		addAction: function(){
			db.addAction({
				name: 'new action',
				status: 'NS'
			}, _.bind(function(action){
				console.log('new action', action[0]);

				if (!_.isArray(this.roomData.actions)) this.roomData.actions = [action[0]._id];
				else {
					var temp = this.roomData.actions.reverse();
					temp.push(action[0]._id);
					this.roomData.actions = temp.reverse();
				}

				console.log('this.roomData.actions',this.roomData.actions);

				db.updateRoom({
					find: {
						_id: this.roomData._id
					},
					set: {
						actions: this.roomData.actions
					}
				}, _.bind(function(){
					console.log('room updated with the new action');
					
					db.socket({
						emit: 'addAction',
						args: {
							newAction: action[0],
							roomData: this.roomData
						}
					})

				}, this));

			}, this));
		},

		getRoomData: function(){

			// get rooms from db
			db.getRooms({
				_id: this.cfg._id
			}, _.bind(function(rooms){
				// render rooms
				this.roomData = rooms[0];
				this.render(rooms[0]);

				// init aiCollecion
				this.aiCollection = new actionItemsCollection({
					roomData: this.roomData
				});

			}, this));
		},

		updateRoomName: function(cfg){

			var roomName = cfg.dialogRoomName;
			console.log('roomName', roomName);
			db.updateRoom({
				find: {
					_id: this.roomData._id
				},
				set: {
					name: roomName
				}
			}, _.bind(function(){
				
				db.socket({
					emit: 'updateRoomName',
					args: {
						_id: this.roomData._id,
						roomName: roomName
					}
				});

			}, this));

		},

		onAddAction: function(cfg){
			console.log('anAddAction', cfg)
			// update room's action only if room is open
			if (this.cfg._id == cfg.roomData._id){
				console.log('this is the room', cfg.roomData);
				// update room data
				this.roomData = cfg.roomData;
				// add new action to action items collection
				this.aiCollection.add(cfg.newAction, cfg.roomData);
			}

		},

		render: function(roomData) {
			console.log('room watch - render');

			this.$el.append(Mustache.render(template, roomData)).appendTo(this.cfg.$parent);
			this.bindEvents();
			events.trigger('setStageHeight');
		},

		dispose: function(){
			this.$el.find('#roomName').unbind('click');
			this.$el.find('#addAction').unbind('click');
			events.off('onAddAction');
			events.off('editRoom');
			events.off('onUpdateRoomName');
			this.aiCollection.dispose();
			this.$el.remove();

			events.trigger('setMenuButton', {
				set: 'disabled',
				id: 'addActionbtn'
			});

			events.trigger('setMenuButton', {
				set: 'disabled',
				id: 'editRoombtn'
			});
			
			events.trigger('setMenuButton', {
				set: 'disabled',
				id: 'zoomBtn'
			});

			events.trigger('setMenuButton', {
				id: 'compressBtn',
				change: {
					compress: true
				}
			});
			
			events.trigger('setMenuButton', {
				set: 'disabled',
				id: 'compressBtn'
			});

			events.off('addAction');
		}

	});	

	return watchRoom;
});