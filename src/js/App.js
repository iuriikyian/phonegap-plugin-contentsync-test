define(['underscore', '$',
    'common-services/ServicesLoader',
    'views/HomeView'
    ], function(_, $, servicesLoader, HomeView){
    'use strict';
    var App = function(){};
    _.extend(App.prototype, {
        // Application Constructor
        initialize : function(config) {
            this.config = config;
            this.bindEvents();
        },

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents : function() {
            document.addEventListener('deviceready', _.bind(this.onDeviceReady, this), false);
            console.log(document.location.protocol);
        },

        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady : function() {
            //app.receivedEvent('deviceready');
            var view = new HomeView({});

            $('body').empty();
            $('body').append(view.render().el);
            this.loadServices().done(function(){
                console.log('services loaded');
            });
        },

        loadServices : function(){
            var dfd = $.Deferred();
            var servicesLoading = servicesLoader.loadServices(this.config.services);
            servicesLoading.always(function(servicesRegistry){
                window.miLoaderServices = servicesRegistry;
                dfd.resolve();
            });
            return dfd.promise();
        }
    });

    return App;
});
