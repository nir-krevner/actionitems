define(['jquery', 'underscore'], function($, _) {

	return {

		getForm: function($el, cfg){

			var res = {};

			_.each(cfg, function(item){
				res[item] = $el.find('#' + item).val();
			});

			return res;

		},

		/**
			sample:
			array: [{_id:.., a:..,b:..},{_id:.., a:..,b:..}]
			alignBy: ['','','',''],
			commonField: '_id'
		*/

		align: function(cfg){

			var res = [];

			if (!cfg.alignBy) return cfg.alignBy;

			_.each(cfg.alignBy, function(value){

				_.each(cfg.array, function(item){
					if (item._id == value){
						res.push(item);
						return;
					}
				});
			});	

			return res;
		}


					


	}

});