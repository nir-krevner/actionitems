define([
	'jquery', 
	'underscore', 
	'backbone', 
	'css!moduls/msg/msg'
], 
function($, _, Backbone) {

	var msg = Backbone.View.extend({

		initialize: function(){
			this.msg = '';
		},

		show: function(msg){
			this.msg = msg;
			$('#msg').html(msg);
		},

		isEmpty: function(){
			return this.msg == '';
		},

		get: function(){
			return this.msg;
		},

		clear: function(){
			$('#msg').html('');
		}

	});	

	return new msg();
});