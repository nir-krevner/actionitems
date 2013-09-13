define([
	'jquery', 
	'underscore', 
	'backbone', 
	'mustache',		
	'text!moduls/dialog/updateRoomNameTemplate.html',
	'text!moduls/dialog/editActionTemplate.html',
	'css!moduls/dialog/dialog',
	'jqueryui'
], 
function($, _, Backbone, Mustache, updateRoomNameTemplate, editActionTemplate) {

	var dialog = Backbone.View.extend({

		el : '#dialog',

		bindEvents: function(){
			this.$('#dialog_close').click(_.bind(function(){this.close()}, this));
			this.$('#dialog_save').click(_.bind(function(a){this.save(a)}, this));
		},

		initialize: function(dialogCfg) {
			this.cfg = dialogCfg;
			this.show();
		},

		render: function(template, cfg) {
			this.$el.html(Mustache.render(template, cfg));
			this.bindEvents();
		},

		show: function(){

			switch (this.cfg.type){

				case 'updateRoomName':
					this.render(updateRoomNameTemplate, {
						oldRoomName: this.cfg.args.oldRoomName
					});
					this.$el.find('.modal').modal();
				break;
				
				case 'editAction': 

					this.render(editActionTemplate, this.cfg.args);

					    $("#dialog #actionAssignName").autocomplete({
					      source: this.cfg.args.showUsers
					    }).blur(_.bind(function(event){
					    	var userShow = $(event.target).val();
					    	var id = _.where(this.cfg.args.usersMap, {userDisplay: userShow});

					    	if (id && id[0] && id[0].userId){
					    		$("#dialog #actionAssignId").val(id[0].userId);
					    	} else {
					    		$("#dialog #actionAssignName").val('');
					    		$("#dialog #actionAssignId").val('');
					    	}
					    	
					    }, this));

					this.$el.find('.modal').modal();

				break;
			}

		},

		close: function(){
			this.$el.find('.modal').modal('hide');
			this.cfg.onClose();
		},

		save: function(){
			this.$el.find('.modal').modal('hide');
			this.cfg.onSave(this.getFormAsJSON());
		},

		getFormAsJSON: function(){
			var res = {};
			_.each(this.$el.find('#dialog_form input'), function(item){
				var $item = $(item);
				res[$item.attr('id')] = $item.val();
			});

			_.each(this.$el.find('#dialog_form textarea'), function(item){
				var $item = $(item);
				res[$item.attr('id')] = $item.val();
			});


			return res;
		}

	});	

	return dialog;
});