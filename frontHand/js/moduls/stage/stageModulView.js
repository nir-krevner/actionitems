define([
	'jquery', 
	'cookie', 
	'underscore', 
	'backbone', 
	'events',
	'mustache',
	'loginModul',
	'initMenuModulView', 
	'text!moduls/stage/stageTemplate.html', 
	'css!moduls/stage/stage',
	'css!moduls/css/fontello'

], 
function($, dontCare, _, Backbone, events, Mustache, loginModul, initMenuModulView, template) {

	var stageModulView = Backbone.View.extend({

		el: "body",

		initialize: function() {
			this.render();
			this.initMembers();
			this.bindEvents();
			this.setStageHeight();
		},

		setStageHeight: function(){
			var docHeight = $(window).height();
			var menuHeight = $('#menu').height();
			var addRoomHeight = $('#addRoom').outerHeight();

			console.log('docHeight',docHeight)
			$('.roomCollection').outerHeight(docHeight-menuHeight-addRoomHeight);
			$('#items').outerHeight(docHeight-menuHeight);
			$('#rooms').outerHeight(docHeight-menuHeight);
		},

		render: function() {
			this.$el.empty().html(Mustache.render(template, {
				user_name: JSON.parse(loginModul.getUser()).name
			}));
		},

		initMembers: function(){
			this.items = $('#items');
			this.menu  = $('#menu');
			this.mode = 'min';
		},

		bindEvents: function(){

			this.$('.menuBtn').click(function(e){
				var $ele = $(e.currentTarget);
				if (!$ele.hasClass('disable')){
					events.trigger($ele.attr('data'));
				}
			});

			events.on('fullScreen', _.bind(function(){
				var cfg;
				this.$el.toggleClass('remove');

				if (this.$el.hasClass('remove')){
					cfg = {
						id: 'zoomBtn',
						changeTitleTo: 'show rooms',
						changeIconTo: 'iconFont-zoom-out'
					}
				} else {
					cfg = {
						id: 'zoomBtn',
						changeTitleTo: 'full screen',
						changeIconTo: 'iconFont-zoom-in'
					}
				}
				events.trigger('setMenuButton', cfg);
			}, this));

			events.on('setMenuButton', function(cfg){
				if (cfg.set == 'disabled'){
					$('#' + cfg.id).addClass('disable');
				} else {
					$('#' + cfg.id).removeClass('disable');
				}

				if (cfg.change){
					var $btn = $('#' + cfg.id);
					if (cfg.change.compress){
						$btn.attr('data','compress');
						$btn.removeClass('decompress');
						$btn.find('i').attr('class', 'iconFont-align-justify');
						$btn.find('#compressTitle').text('compress');
					} else {
						$btn.attr('data','decompress');
						$btn.addClass('decompress');
						$btn.find('i').attr('class', 'iconFont-stop');
						$btn.find('#compressTitle').text('decompress');
					}
				}

				if (cfg.changeIconTo){
					var $btn = $('#' + cfg.id);
					$btn.find('i').attr('class', cfg.changeIconTo);
				}

				if (cfg.changeTitleTo){
					var $btn = $('#' + cfg.id);
					$btn.children().eq(1).text(cfg.changeTitleTo);
				}
				
			});

			$(window).bind("resize", function(){
				events.trigger('setStageHeight');
			});

			events.on('setStageHeight', this.setStageHeight);

		},

		dispose: function(){
			events.off('changeWorkspace');
			events.off('maximize');
			events.off('minimize');
			events.off('fullScreen');
			events.off('setMenuButton');
			$(window).unbind("resize");
			this.$('.menuBtn').unbind('click');
			events.off('setStageHeight', this.setStageHeight);
		}

	});	

	return stageModulView;
});