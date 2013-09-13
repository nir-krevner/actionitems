define(['jquery', 
	'underscore', 
	'backbone', 
	'db',
	'initMenuModulView',
	'loginModul',
	'router',
	'utils',
	'msg',
	'mustache',
	'text!moduls/join/joinTemplate.html', 
	'css!moduls/join/join'
], 
function($, _, Backbone, db, initMenuModulView, loginModul, router, utils, msg, Mustache, template) {

	var joinModulView = Backbone.View.extend({

		el: "body",

		initialize: function(cfg) {
			this.cfg = cfg;
			this.render();
			this.bindEvents();
		},

		bindEvents: function(){
			var that = this;

			$(document).keyup(function(e){
				if (e.keyCode == 13)
					that[that.cfg.addMode ? 'submitAdd' : 'submitJoin']();
			});

			this.$('#submitJoin').click(function(){that.submitJoin();});
			this.$('#submitAdd').click(function(){that.submitAdd();});
		},

		render: function() {

			this.$el.empty().html(Mustache.render(template, this.cfg));
			// init small menu
			new initMenuModulView({items: [
				{label: 'sign in', href: '#login'},
				{label: 'forgot password', href: '#forgotPassword'}
			]});
		},

		submitJoin: function(){

			console.log('submitJoin')
			var user = utils.getForm(this.$el, ['name', 'email', 'companyName', 'password1', 'password2']);

			this.validUser(user, function(){
									// insert company to db
									db.insertCompany({
											name: user.companyName
										}, function(data){

											var userForDB = {
												email: user.email,
												name : user.name,
												password: user.password1,
												companyId: data[0]._id
											};

											db.insertUser(userForDB, function(){
												loginModul.setUser(userForDB);
												require('router').navigate("stage", {trigger: true});
											});

										}
									);

								}, 
								function(notValidData){
									msg.show(notValidData);
								}

			);				

		},

		submitAdd: function(){

			console.log('submitAdd')
			var user = utils.getForm(this.$el, ['name', 'email', 'password1', 'password2']);

			this.validUser(user, function(){

									var userForDB = {
										email: user.email,
										name : user.name,
										password: user.password1,
										companyId: JSON.parse(loginModul.getUser()).companyId
									};

									db.insertUser(userForDB, function(){

										db.socket({
											emit: 'updateUsers',
											args: {
												companyId: JSON.parse(loginModul.getUser()).companyId
											}
										});

										require('router').navigate("stage", {trigger: true});
									});

								}, 
								function(notValidData){
									msg.show(notValidData);
								}

			);				

		},

		validUser: function(user, validCB, notValidCB){

			var that = this;

			msg.clear();

			var notValid = [];
			_.each(user, function(item, idx){
				if (item == '') notValid.push(idx); 
			});

			if (notValid.length > 0) {
				notValidCB('please fill: ' + notValid.join(', '));
				return false;
			}

			if (user.password2 != user.password1){
				notValidCB('password didnt match');
				return false;
			}

			db.isUserValid({email: user.email}, function(valid){

				console.log('valid:' + valid);

				if (!valid){
					notValidCB('user already exists');
					return false;
				} 

				// on add mode, dont perform a company validation
				if (that.cfg.addMode){

					validCB();

				} else {

					db.isCompanyValid({name: user.companyName}, function(valid){

						if (!valid){
							notValidCB('company already exists');
							return false;
						} else {
							validCB();
						}
					});
				}
			});
		},

		dispose: function(){
			console.log('dispose joinModel');
			this.$('#submitJoin').unbind('click');
			this.$('#submitAdd').unbind('click');
			$(document).unbind('keyup');
		}

	});	

	return joinModulView;
});