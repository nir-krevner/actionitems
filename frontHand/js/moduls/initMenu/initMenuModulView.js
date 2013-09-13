define(['jquery', 
	'underscore', 
	'backbone',
	'mustache',
	'text!moduls/initMenu/initMenuTemplate.html', 
	'css!moduls/initMenu/initMenu'
], 
function($, _, Backbone, Mustache, template) {

	var initMenuModulView = Backbone.View.extend({

		el: "#initMenu",

		initialize: function(cfg) {
			this.cfg = cfg;
			this.render();
		},

		render: function() {
			this.$el.append(Mustache.render(template, this.cfg));
		}

	});	

	return initMenuModulView;
});