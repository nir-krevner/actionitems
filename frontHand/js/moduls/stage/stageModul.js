define(['jquery', 
	'cookie', 
	'underscore', 
	'backbone', 
	'stageModulView',
	'stageUsersView',
    'rooms',
    'loginModul',
    'events'
	], 
	function($, dontCare, _, Backbone, stageModulView, stageUsersView, rooms, loginModul, events) {

    var stageModul = {

        initialize : function(){

        	this.view = new stageModulView({
        		controller: this
        	});

            this.users = new stageUsersView({
                controller: this
            });

        	this.rooms = new rooms({
        		controller: this
        	});

            this.bindEvents();

        },

        bindEvents: function(){
            events.on('onUpdateUsers', _.bind(function(data){
                if (data.companyId == JSON.parse(loginModul.getUser()).companyId){
                    this.users.dispose();

                    this.users = new stageUsersView({
                        controller: this,
                        onDone: function(){
                            events.trigger('setStageHeight');
                        }
                    });

                }
            }, this));
        },

        dispose: function(){
            console.log('dispose stageModul');
            this.view.dispose();
            this.users.dispose();
            this.rooms.dispose();
        }

    };

    return stageModul;

});