define(['underscore', '$', 'backbone',  'utils'  ],
function(_, $, Backbone , utils ){
    'use strict';
	return Backbone.View.extend({
        className : 'home-view',
        
		template : utils.template('home-view'),
		

		initialize : function(options){
			//
		},

		
		render : function(){
			var $el = $(this.el);
			$el.empty();
			$el.append(this.template({}));
			return this;
		}
		
	});
});