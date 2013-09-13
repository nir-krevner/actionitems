define(['jquery', 'underscore', 'backbone', 'loginModul', 'joinModul', 'stageModul'], 
function($, _, Backbone, loginModul, joinModul, stageModul) {

	var router = Backbone.Router.extend({

		initialize: function(){
			this.active = {};
			Backbone.history.start(); 
		},

		routes: {
			""						: "default",
			"login"					: "login",
			"join"					: "join",
			"stage"					: "stage",
			"addUser"				: "addUser",
			"logout"				: "logout"
			// "search/:query":        "search",  // #search/kiwis
			// "search/:query/p:page": "search"   // #search/kiwis/p7
		},

		default: function(){

			var user = loginModul.getUser();

	        if (user){
	        	this.navigate("stage", {trigger: true});
	        } else {
	        	this.navigate("login", {trigger: true});
	        }

		},

		login: function(){
			this.setActive('login', loginModul);
			loginModul.login();
		},

		logout: function(){
			loginModul.logout();
			this.login();
		},

		addUser: function(){
			if (this.validate()){
				this.setActive('join', joinModul);
				joinModul.add();
			}
			else this.navigate('login');
		},

		join: function(){
			this.setActive('join', joinModul);
			joinModul.join();
		},

		stage: function(){
			if (this.validate()) {
				this.setActive('stage', stageModul);
				stageModul.initialize();
			}
			else this.navigate('login');
		},

		validate: function(){
			var user = loginModul.getUser();
			return user && user != '';
		},

		setActive: function(screen, obj){
			// dispose active screen
			this.dispose();

			this.active = {
				screen: screen,
				obj: obj
			}
		},

		dispose: function(){
			if (this.active.obj) this.active.obj.dispose();
		}

	});	

	return new router();
});