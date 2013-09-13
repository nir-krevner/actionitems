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
	'utils',
	'stageUsersView',
	'initMenuModulView', 
	'text!moduls/actionItemsCollection/template.html', 
	'css!moduls/actionItemsCollection/actionItemsCollection'
], 
function($, dontCare, _, Backbone, db, Mustache, dialog, loginModul, events, utils, stageUsersView, initMenuModulView, template) {

	var actionItemsCollection = Backbone.View.extend({

		el: '#actionItemCollection',

		initialize: function(cfg) {
			this.cfg = cfg;
			this.roomData = this.cfg.roomData;

			this.setSortable();
			this.show();
			events.on('onUpdateAction', _.bind(function(d){this.onUpdateAction(d);}, this));
			events.on('compress', _.bind(function(d){this.compress(d);}, this));
			events.on('decompress', _.bind(function(d){this.decompress(d);}, this));
		},

		statusArray: [
			{status: 'NS'},
			{status: 'IP'},
			{status: 'DN'}
		],

		setSortable: function(){

			this.$el.sortable({
				opacity: .5,
				update: _.bind(function(){
					console.log('after sortable');
					var actionsOrder = [];
					this.$el.children().each(function(index, item){
						actionsOrder.push($(item).attr('actionid'));
					});
					console.log('actionsOrder', actionsOrder);

					if (this.roomData.name != 'my room'){
						// update room
						db.updateRoom({
							find: {
								_id: this.roomData._id
							},
							set: {
								actions: actionsOrder
							}
						}, _.bind(function(){

							db.socket({
								emit: 'updateActionsOrder',
								args: {
									actions: actionsOrder,
									roomData: this.roomData
								}
							});

						}, this));
					}
					
				}, this)
		    });

		    this.$el.disableSelection();
		},

		add: function(newAction, roomData){
			// update roomData
			this.roomData = roomData;
			// update actionObjects
			if (this.actionObjects)
				this.actionObjects.unshift(newAction);
			else
				this.actionObjects = [newAction];
			// render singleAction
			this.render([newAction]);

		},

		show: function(){

			db.getActions({actions: this.roomData.actions}, _.bind(function(actions){
				console.log('actions' ,actions);

				 this.actionObjects = utils.align({
					array: actions,
					alignBy: this.roomData.actions,
					commonField: '_id'
				});

				console.log('actionObjects', this.actionObjects);

				this.render();

			}, this));


		},

		bindEvents: function(newAction){

			console.log('newAction', newAction);
			var that = this;

			var newActionDomCertina = '';
			if (newAction){
				newActionDomCertina = '[actionid=' + newAction[0]._id + ']';
			}

			events.on('onUpdateActionsOrder', _.bind(function(data){
				this.onUpdateActionsOrder(data);
			}, this));

			this.$el.find('.singleAction' + newActionDomCertina).each(function(idx, ele){
				var $ele = $(ele);

				$ele.mouseover(function(){
					if($ele.hasClass('compress')){
						$ele.removeClass('compress');
						$ele.attr('compressMode', 'true');
					}
				});

				$ele.mouseout(function(){
					if($ele.attr('compressMode') == 'true'){
						$ele.addClass('compress');
						$ele.attr('compressMode', 'true');
					}
				});

				$ele.find('.menuController').mousedown(function(e){
					console.log('clicked !')
					var $targetEle = $(e.currentTarget);
					var actionId = $ele.attr('actionId');
					var data = $targetEle.attr('data');
					switch (data){
						case 'right':
							that.move($ele, actionId, 'right');
							break;
						case 'left':
							that.move($ele, actionId, 'left');
							break;
						case 'edit':
							that.edit($ele, actionId);
					}
					
				});

			});

		},

		edit: function($ele, actionId){

			var action = _.filter(this.actionObjects, function(item){
				return item._id == actionId;
			})[0];

			db.getUser({
				companyId: JSON.parse(loginModul.getUser()).companyId
			}, _.bind(function(users){

				var showUsers = _.map(users, function(item){
					return item.name + ' <' + item.email + '>'
				});

				var usersMap = _.map(users, function(item){
					return {
						userDisplay: item.name + ' <' + item.email + '>',
						userId: item._id
					}
				});

				var actionAssignName;

				if (action.assign){
					// get user
					var temp = _.where(users, {_id: action.assign});

					if (temp[0]){
						actionAssignName = temp[0].name + ' <' + temp[0].email + '>'
					}
				}
				
				this.dialog = new dialog({
					type: 'editAction',
					args: {
						actionName: action.name,
						actionContent: action.content,
						actionAssignId: action.assign,
						actionAssignName: actionAssignName,
						usersMap: usersMap,
						showUsers: showUsers
					},
					onClose: function(){},
					onSave: _.bind(function(data){
						console.log('editAction', data);
						db.updateAction({
							find: {
								_id: actionId
							}, 
							set: {
								name: data.actionName,
								content: data.actionContent,
								assign: data.actionAssignId
							}			
							
						}, function(data){

							console.log('data recieved from update:', data);

							var assign = _.where(users, {_id: data.assign});

							if (action.assign != data.assign && !!data.assign && !!assign[0]){
								db.sendEmail({
									type: 'newAction',
									name: assign[0].name,
									email: assign[0].email
								});
							};

							console.log('on update actin data update', data)

							db.socket({
								emit: 'updateAction',
								args: {
									actionData: data
								}
							});

						});


					}, this)
				});


			}, this));


		},

		move: function($ele, actionId, direction){

			var action = _.filter(this.actionObjects, function(item){
				return item._id == actionId;
			})[0];

			var status = action.status;
			var nextStatus = this.setNextStatus(status, direction);

			console.log('next status', nextStatus);

			if (nextStatus){
				action.status = nextStatus;

				// update db
				db.updateAction({
					find: {
						_id: action._id
					},
					set: {
						status: action.status
					}
				}, function(data){
					if (!data) throw 'update action failed'

					// emit socket
					db.socket({
						emit: 'updateAction',
						args: {
							oldStatus: status,
							actionData: action
						}
					});
				});

			} else {
				$ele.remove();
			}

		},

		setNextStatus: function(status, direction){

			var statusIdx;
			_.each(this.statusArray, function(item, idx){
				if (item.status == status) statusIdx = idx;
			});

			statusIdx = direction == 'right' ? ++statusIdx : --statusIdx;

			if (statusIdx == -1){
				return 0;
			}

			if (statusIdx == this.statusArray.length){
				return null;
			}

			return this.statusArray[statusIdx].status;

		},

		render: function(newAction) {


			db.getUser({
				companyId: JSON.parse(loginModul.getUser()).companyId
			}, _.bind(function(users){

				// clone
				var stringify = JSON.stringify(newAction || this.actionObjects);
				if (!stringify) return false;
				
				var actionObjects = JSON.parse(stringify);

				_.each(actionObjects, function(action){

					if (action.assign){
						var temp = _.where(users, {_id: action.assign});

						if (temp[0]){
							action.assign = temp[0].name + ' <' + temp[0].email + '>'
						}
					}

				});

				console.log('action Items Collection - render');
				this.$el.prepend(Mustache.render(template, {actions: actionObjects}));
				this.bindEvents(newAction);
								
			}, this));

		},

		onUpdateAction: function(data){

			console.log('onUpdateAction', data)

			var updatedActionData = data.actionData,
				action, actionIdx;

			_.each(this.actionObjects, function(item, idx){
				if (item._id == data.actionData._id){
					action = item;
					actionIdx = idx;
				}
			});

			if (!action){
				console.log('this is not the room where the action updated');
				return false;
			} 

			var oldActionData = JSON.parse(JSON.stringify(action));
			var	$actionEle = this.$('div[actionid=' + data.actionData._id + ']');

			this.actionObjects[actionIdx] = data.actionData;

			if (data.oldStatus){
				$actionEle.removeClass(data.oldStatus).addClass(updatedActionData.status);
			}

			if (data.actionData.name != oldActionData.name){
				$actionEle.find('.actionName').text(data.actionData.name);
			}

			if (data.actionData.content != oldActionData.content){
				$actionEle.find('.actionContent').text(data.actionData.content);
			}

			if (data.actionData.assign != oldActionData.assign){
				
				db.getUser({
					_id: data.actionData.assign,
				}, function(users){
					if (users[0]){
						var assignDisplay = users[0].name + ' <' + users[0].email + '>';
						$actionEle.find('.actionAssign').text(assignDisplay);
					}
				});

			}

		},

		onUpdateActionsOrder: function(data){
			console.log('onUpdateActionsOrder', data)

			if (data.roomData._id == this.roomData._id){

				// get actions order
				var actionsOrder = [];
				this.$el.children().each(function(index, item){
					actionsOrder.push($(item).attr('actionid'));
				});

				console.log('action order', actionsOrder, 'data.actions', data.actions);

				if (JSON.stringify(actionsOrder) != JSON.stringify(data.actions)){
					console.log('up update actions order - need a change !');

					_.each(data.actions, _.bind(function(item, index){
						$('div[actionid=' + item + ']').appendTo(this.$el);
					}, this));

				}

			}
		},

		compress: function(){
			this.$('.singleAction').addClass('compress');

			events.trigger('setMenuButton', {
				id: 'compressBtn',
				change: {
					compress: false
				}

			});
		},

		decompress: function(){
			this.$('.singleAction').removeClass('compress').removeAttr('compressMode');

			events.trigger('setMenuButton', {
				id: 'compressBtn',
				change: {
					compress: true
				}

			});
		},

		dispose: function(){
			console.log('actionItemsCollection dispose');
			this.$el.unbind('sortable');
			events.off('onUpdateAction');
			events.off('compress');
			events.off('decompress');

			this.$el.find('.singleAction').each(function(idx, ele){
				var $ele = $(ele);
				$ele.unbind('mouseover');
				$ele.unbind('mouseout');
				$ele.find('.right').unbind('click');
				$ele.find('.left').unbind('click');
				$ele.find('.edit').unbind('click');
			});


			this.$el.remove();
		}

	});	

	return actionItemsCollection;
});