define(['jquery', 'underscore', 'backbone', 'joinModulView'], 
	function($, _, Backbone, joinModulView) {

    var joinModul = {

        join : function(){
        	this.view = new joinModulView({
        		controller: this
        	}); 
        },

        add: function(){
        	this.view = new joinModulView({
        		addMode: true,
        		controller: this
        	}); 
        },

        dispose: function(){
            this.view.dispose();
        }

    };

    return joinModul;

});