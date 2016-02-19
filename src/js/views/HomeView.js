define(['underscore', '$', 'backbone',  'utils', 'ContentSyncService'  ],
function(_, $, Backbone , utils, ContentSyncService ){
    'use strict';

    function _getSrv(){
    	return window.miLoaderServices.get('app-sync');
    }

	return Backbone.View.extend({
        className : 'home-view',

		template : utils.template('home-view'),


		initialize : function(options){
			var srv_host = 'http://3000.192.168.1.58.xip.io';
			this._srv = new ContentSyncService({
				statusUrl : srv_host + '/status',
				contentVersionField : 'contentVersion',
				contentUrl : srv_host + '/content.zip',
				contentId : 'app'
			});
			this._handlers = {
				'local-version' : _.bind(this._onLocalVersion, this),
				'local-path' : _.bind(this._onLocalPath, this),
				'check-update' : _.bind(this._onCheckUpdate, this),
				'fetch-update' : _.bind(this._onFetchUpdate, this),
				'load-update' : _.bind(this._onLoadUpdate, this)
			};
		},


		render : function(){
			var $el = $(this.el);
			$el.empty();
			$el.append(this.template({}));
			this.initHandlers();
			return this;
		},

		initHandlers : function(){
			this.$('.btn').on('click', _.bind(this._onButtonClick, this));
		},

		_onButtonClick : function(evt){
			var $target = $(evt.target);
			var command = $target.data('command');
			console.log(command);
			var handler = this._handlers[command];
			if(_.isUndefined(handler)){
				console.error('fail to find handler for command: ' + command);
			}else{
				handler();
			}
		},

		_onLocalVersion : function(){
			_getSrv().getVersion()
				.done(_.bind(function(version){
					this._log('local version: ' + version);
				}, this))
				.fail(_.bind(function(err){
					this._log(err);
				}, this));
		},

		_onLocalPath : function(){
			_getSrv().getPath()
				.done(_.bind(function(path){
					this._log('local path: ' + path);
				}, this))
				.fail(_.bind(function(err){
					this._log(err);
				}, this));
		},

		_onCheckUpdate : function(){
			_getSrv().hasUpdate()
				.done(_.bind(function(has, localVersion, remoteVersion){
					if(has){
						this._log('update available: ' + localVersion + ' / ' + remoteVersion);
					}else{
						this._log('no update available');
					}
				}, this))
				.fail(_.bind(function(err){
					this._log(err);
				}, this));
		},
		_onFetchUpdate : function(){
			_getSrv().sync()
				.done(_.bind(function(info){
					this._log('content synced');
				}, this))
				.fail(_.bind(function(err){
					this._log('fail to sync content: ' + err);
				}, this));

		},
		_onLoadUpdate : function(){
			_getSrv().getPath()
				.done(_.bind(function(path){
					if(path){
						var loadPath = [path, 'index.html'].join('/');
						console.log('loading: ' + loadPath);
						document.location.href = loadPath;
					}else{
						this._log('no local path available');
					}
				}, this));
		},

		_log : function(msg){
			this.$('.log').append('<div>' + msg + '</div>');
		}
	});
});