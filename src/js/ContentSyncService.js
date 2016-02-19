define(['underscore', 'jquery', 'common-services/utils'], function(_, $, commonUtils){

    var _defaults = {
        requestMethod : 'GET',
        statusVersionField : 'contentVersion',
        disabled : false,
        requestTimeout: 10000 // msec
    };

    var UNKNOWN_VERSION = '0';

    // if provided contentUrlField then it is used to get resource url from contentUrl JSON response
    function ContentSyncService(options){
        var opts = _.pick(options,
                            'statusUrl', 'statusVersionField',
                            'contentUrl', 'contentUrlField',
                            'contentId',
                            'pstorageName',
                            'requestMethod',
                            'requestTimeout', 'disabled', 'version');
        _.defaults(opts, _defaults);
        this._opts = opts;
    }

    _.extend(ContentSyncService.prototype, {
        init : function(servicesRegistry){
            if(_.isUndefined(window.ContentSync)){
                return commonUtils.rejectedPromise('ContentSync plugin is not found');
            }
            var storage = servicesRegistry.get(this._opts.pstorageName);
            if(_.isUndefined(storage)){
                return commonUtils.rejectedPromise('Service is not found: ' + this._opts.pstorageName);
            }
            this._storage = storage;
            return commonUtils.resolvedPromise();
        },

        /* version of the local synced content */
        getVersion : function(){
            var dfd = $.Deferred();
            this._storage.getData()
                .done(function(data){
                    dfd.resolve(data.version || UNKNOWN_VERSION);
                })
                .fail(function(err){
                    console.error(err);
                    dfd.resolve(UNKNOWN_VERSION);
                });
            return dfd.promise();
        },

        getPath : function(){
            var dfd = $.Deferred();
            this._storage.getData()
                .done(function(data){
                    dfd.resolve(data.path);
                })
                .fail(function(err){
                    console.error(err);
                    dfd.resolve();
                });
            return dfd.promise();
        },

        /* check if update is available

            if update is available also reports current and available versions.
        */
        hasUpdate : function(){
            if(!commonUtils.isConnected()){
                return commonUtils.resolvedPromise(false);
            }
            var dfd = $.Deferred();
            $.when(
                this.getVersion(),
                this._getAvailableVersion()
            ).done(function(localVersion, remoteVersion){
                dfd.resolve(localVersion !== remoteVersion, localVersion, remoteVersion);
            }).fail(function(err){
                dfd.reject(err);
            });
            return dfd.promise();
        },

        sync : function(){
            var dfd = $.Deferred();
            this._fetchContentUrl()
                .done(_.bind(function(contentUrl){
                    var opts = this._opts;
                    var sync = window.ContentSync.sync({
                        src : contentUrl,
                        id : opts.contentId,
                        timeout : opts.requestTimeout
                    });
                    sync.on('complete', _.bind(function(data){
                        console.log(data);
                        this._getAvailableVersion()
                            .then(_.bind(this._saveData, this, data))
                            .then(dfd.resolve, dfd)
                            .fail(dfd.reject, dfd);
                    }, this));
                    sync.on('error', function(err){
                        console.error(err);
                        dfd.reject(err);
                    });
                }, this))
                .fail(function(err){
                    console.error(err);
                    dfd.reject(err);
                });
            return dfd.promise();
        },

        _fetchContentUrl : function(){
            var opts = this._opts;
            if(_.isUndefined(opts.contentUrlField)){
                return commonUtils.resolvedPromise(opts.contentUrl);
            }
            var dfd = $.Deferred();
            $.ajax({
                url : opts.contentUrl,
                type : opts.requestMethod,
                data : '',
                timeout : opts.requestTimeout,
                context : this,
                success : function(data, status, xhr){
                    if (status === 'success' && xhr.status === 200) {
                        console.log(JSON.stringify(data));
                        try{
                            data = _.isString(data) ? JSON.parse(data) : data;
                            var url = data[opts.contentUrlField];
                            if(_.isUndefined(url)){
                                console.error('fail get content url');
                                dfd.reject();
                            }else{
                                console.log('content url: ' + url);
                                dfd.resolve(url);
                            }
                        }catch(e){
                            console.error('fail to parse server responce');
                            dfd.reject();
                        }
                    } else { // treat everything else as an error
                        console.error('error responce status recieved');
                        dfd.reject();
                    }
                },
                error : function(xhr, errorType, error){
                    console.error('error responce recieved');
                    dfd.reject();
                }
            });
            return dfd.promise();
        },

        _getAvailableVersion : function(){
            var dfd = $.Deferred();
            var opts = this._opts;
            $.ajax({
                url : opts.statusUrl,
                type : opts.requestMethod,
                data : '',
                timeout : opts.requestTimeout,
                context : this,
                success : function(data, status, xhr){
                    if (status === 'success' && xhr.status === 200) {
                        console.log(JSON.stringify(data));
                        try{
                            data = _.isString(data) ? JSON.parse(data) : data;
                            var version = data[opts.statusVersionField];
                            if(_.isUndefined(version)){
                                console.error('fail get content version');
                                dfd.reject();
                            }else{
                                console.log('content version: ' + version);
                                dfd.resolve(version);
                            }
                        }catch(e){
                            console.error('fail to parse server responce');
                            dfd.reject();
                        }
                    } else { // treat everything else as an error
                        console.error('error responce status recieved');
                        dfd.reject();
                    }
                },
                error : function(xhr, errorType, error){
                    console.error('error responce recieved');
                    dfd.reject();
                }
            });
            return dfd.promise();
        },

        _saveData : function(data, version){
            return this._storage.setData({
                version : version,
                path : data.localPath
            });
        }
    });

    return ContentSyncService;
});