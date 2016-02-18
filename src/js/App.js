define(['underscore', '$',
    
    'views/HomeView'
    ], function(_, $, HomeView){
    'use strict';
    return function(){
        // Application Constructor
        this.initialize = function(config) {
            this.config = config;
            this.bindEvents();
        };

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        this.bindEvents = function() {
            document.addEventListener('deviceready', _.bind(this.onDeviceReady, this), false);
            console.log(document.location.protocol);
        };

        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        this.onDeviceReady = function() {
            //app.receivedEvent('deviceready');
            var view = new HomeView({});
            
            $('body').empty();
            $('body').append(view.render().el);
            
        };
    };
});
