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

	var watchMyRoom = Backbone.View.extend({

		id: "actionitems",

		initialize: function(cfg) {
			this.cfg = cfg;
			this.getRoomData();
		},

		bindEvents: function(){
			this.$el.find('#addAction').click(_.bind(function(){this.addAction()}, this));
			this.$el.find('#changeWorkspace').click(function(){events.trigger('changeWorkspace');});

			events.on('maximize', _.bind(maximize, this));

			events.on('minimize', _.bind(minimize, this));

			events.on('onAddAction', _.bind(function(cfg){
				this.onAddAction(cfg);
			}, this));

			events.on('onUpdateAction', _.bind(function(cfg){
				this.onUpdateAction(cfg);
			}, this));

			events.trigger('setMenuButton', {
				set: 'enabled',
				id: 'addActionbtn'
			});

			events.trigger('setMenuButton', {
				set: 'enabled',
				id: 'zoomBtn'
			});
			
			events.trigger('setMenuButton', {
				set: 'enabled',
				id: 'compressBtn'
			});

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
				status: 'NS',
				assign: JSON.parse(loginModul.getUser())._id
			}, _.bind(function(action){
				console.log('new action', action[0]);

				if (!_.isArray(this.roomData.actions)) this.roomData.actions = [action[0]._id];
				else {
					var temp = this.roomData.actions.reverse();
					temp.push(action[0]._id);
					this.roomData.actions = temp.reverse();
				}

				console.log('this.roomData.actions',this.roomData.actions);

				db.socket({
					emit: 'addAction',
					args: {
						newAction: action[0],
						roomData: this.roomData,
						myRoomUserId: JSON.parse(loginModul.getUser())._id
					}
				});

			}, this));
		},

		getRoomData: function(){

			// get rooms from db
			db.getActions({
				assign: JSON.parse(loginModul.getUser())._id
			}, _.bind(function(actions){

				// render rooms
				this.roomData = {
					name: 'my room',
					disableUpdateRoom: true,
					actions: _.map(actions, function(item){
						return item._id
					})
				};

				this.render(this.roomData);

				// init aiCollecion
				this.aiCollection = new actionItemsCollection({
					roomData: this.roomData
				});

			}, this));
		},

		onAddAction: function(cfg){
			console.log('anAddAction', cfg)

			// update room's action only if room is open
			if (cfg.myRoomUserId == JSON.parse(loginModul.getUser())._id){
				// update room data
				this.roomData = cfg.roomData;
				// add new action to action items collection
				this.aiCollection.add(cfg.newAction, cfg.roomData);
			}
		},

		onUpdateAction: function(cfg){
			console.log('onUpdateAction - watchMyRoom', cfg);

			var isActionAlreadySetInMyRoom = false;
			_.each(this.roomData.actions, function(action){
				if (action == cfg.actionData._id){
					isActionAlreadySetInMyRoom = true;
				}
			});

			if (cfg.actionData.assign == JSON.parse(loginModul.getUser())._id  && !isActionAlreadySetInMyRoom){
				this.roomData.actions.unshift(cfg.actionData._id);
				this.aiCollection.add(cfg.actionData, this.roomData);
			}
		},

		render: function(roomData) {
			console.log('room watch - render');

			this.$el.append(Mustache.render(template, roomData)).appendTo(this.cfg.$parent);
			this.bindEvents();
			events.trigger('setStageHeight');
		},

		dispose: function(){
			this.$el.find('#addAction').unbind('click');
			this.$el.find('#changeWorkspace').unbind('click');
			events.off('maximize', maximize);
			events.off('minimize', minimize);
			events.off('onAddAction');
			events.off('onUpdateAction');
			this.aiCollection.dispose();
			this.$el.remove();

			events.trigger('setMenuButton', {
				set: 'disabled',
				id: 'addActionbtn'
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
		}

	});	

	function maximize(){
		var changeWorkspace = this.$el.find('#changeWorkspace');
		changeWorkspace.find('.title').text('show menu');
		changeWorkspace.find('i').removeClass('icon-arrow-left').addClass('icon-arrow-right');
	}

	function minimize(){
		var changeWorkspace = this.$el.find('#changeWorkspace');
		changeWorkspace.find('.title').text('full screen');
		changeWorkspace.find('i').removeClass('icon-arrow-right').addClass('icon-arrow-left');
	}

	return watchMyRoom;
});