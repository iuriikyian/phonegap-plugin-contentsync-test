/*global require,define,console*/
/*jslint nomen: true*/  //<- allw _ in the begining and at the end
/*jslint white: true*/ //<- now additional whitespaces in function(){}
console.log('configuration started');
require.config({
	paths : {
        underscore              : 'libs/underscore/underscore',
        backbone                : 'libs/backbone/backbone',
        hammer                  : 'libs/hammerjs/hammer',

        templates               : 'jst.min',



        jquery                  : 'libs/jquery/dist/jquery',





    },
    shim   : {

        'underscore': {
            exports: '_'
        },




        'jquery': {
            exports: '$'
        },

        'backbone': {
            deps   : [ 'underscore', 'jquery' ],
            exports: 'Backbone'
        },





        'hammer': {
            exports: 'Hammer'
        }
    },
    map    : {
        '*': {


            $ : 'jquery',


            _: 'underscore'
        }
    }

});
console.log('configuration finished');

var config = {};

require(['App', 'config-services'], function(App, configServices){
    'use strict';
	console.log('starting app');
    var app = new App();
    config.services = configServices;
	app.initialize(config);
});
