define(['jquery', 'cookie', 'underscore', 'backbone', 'loginModulView'], 
	function($, dontCare, _, Backbone, loginModulView) {

    var loginModul = {

        getUser : function(){
            var user = $.cookie('action_items');
            console.log('user: ' + user);
            return user;
        },

        login : function(){
        	this.view = new loginModulView({
        		controller: this
        	}); 
        },

        logout: function(){
            $.cookie('action_items', '');
        },

        setUser: function(user){
            $.cookie('action_items', JSON.stringify(user));
        },

        logout: function(){
            $.cookie('action_items','');
        },

        dispose: function(){
            this.view.dispose();
        }

    };

    return loginModul;

});