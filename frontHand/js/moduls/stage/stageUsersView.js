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
	'text!moduls/stage/stageUsersTemplate.html', 
	'css!moduls/stage/stageUsers'
], 
function($, dontCare, _, Backbone, db, Mustache, loginModul, events, initMenuModulView, template) {

	var stageUsersView = Backbone.View.extend({

		el: "#users",

		initialize: function(cfg) {
			this.cfg = cfg;
			this.getUsersData();
		},

		bindEvents: function(){
			this.$('#addUser').click(_.bind(function(){this.addUser();}, this));
			this.$('#logout').click(_.bind(function(){this.logout();}, this));
		},

		addUser: function(){
			require('router').navigate('#addUser', {trigger: true});
		},

		getUsersData: function(){

			console.log('loginModul.getUser(): ' + loginModul.getUser())
			// get users from db
			db.getUser({
				companyId: JSON.parse(loginModul.getUser()).companyId
			}, _.bind(function(users){
				// render users
				this.render(users);
				this.bindEvents();
			}, this));
		},

		render: function(users) {
			console.log('stage user view - render', users);

			var user = JSON.parse(loginModul.getUser());
			var userDisplay = user.name;

			this.$el.append(Mustache.render(template, {
				users: users,
				companyName: users[0].companyName,
				userDisplay: userDisplay
			}));

			this.cfg.onDone && this.cfg.onDone();
		},

		reload: function(){
			this.$el.empty();
			this.getUsersData();
		},

		logout: function(){
			loginModul.logout();
			require('router').navigate('#login', {trigger: true});
		},

		dispose: function(){
			this.$('#addUser').unbind('click');
			this.$('#logout').unbind('click');
			this.$el.empty();
		}

	});	

	return stageUsersView;
});