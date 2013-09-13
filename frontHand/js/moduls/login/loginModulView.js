define([
	'jquery', 
	'cookie', 
	'underscore', 
	'backbone', 
	'msg',
	'initMenuModulView', 
	'text!moduls/login/loginTemplate.html', 
	'css!moduls/login/login'
], 
function($, dontCare, _, Backbone, msg, initMenuModulView, template) {

	var loginModulView = Backbone.View.extend({

		el: "body",

		initialize: function() {

			this.render();

			new initMenuModulView({items: [
				{label: 'add a new company to action items', href: '#join'},
				{label: 'forgot password', href: '#forgotPassword'}
			]});

			this.bindEvents();
		},

		bindEvents: function(){
			var that = this;

			$(document).keyup(function(e){
				if (e.keyCode == 13) that.submitLogin();
			});

			this.$el.find('.loginLinks').click(function(){
				that.submitLogin();
			});
		},

		render: function() {
			this.$el.empty().html(template);
		},

		submitLogin: function(){
			console.log('submitLogin');

			var user = {
				email		: this.$el.find('#email').val(),
				password 	: this.$el.find('#password').val()
			}

			require('db').getUser(user, _.bind(function(userData){

				if (userData){
					this.options.controller.setUser(userData[0]);
					require('router').navigate('#stage', {trigger: true});
				} else {
					msg.show('wrong user name or password');
				}

			}, this));	
		},

		dispose: function(){
			console.log('dispose login');
			this.$('.loginLinks').unbind('click');
			$(document).unbind('keyup');
		}

	});	

	return loginModulView;
});