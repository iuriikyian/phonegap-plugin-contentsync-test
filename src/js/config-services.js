define([
    "common-services/services/StorageService",
    "common-services/services/PersistentDataService",
    "ContentSyncService"
], function(StorageService, PersistentDataService, ContentSyncService){
    var srv_host = 'http://3000.192.168.1.58.xip.io';
    return [
        {
            key : 'small-storage',
            module : StorageService,
            settings : {
                mode : 'localStorage' // 'memory', 'localStorage', 'fileStorage'
            }
        },
        {
            key : 'app-sync-pstorage',
            module : PersistentDataService,
            settings : {
                storageName : 'small-storage',
                storageKey : 'app-sync-pstorage'
            }
        },
        {
            key : 'app-sync',
            module : ContentSyncService,
            settings : {
                statusUrl : srv_host + '/status',
                contentVersionField : 'contentVersion',
                //contentUrl : srv_host + '/content.zip',
                contentUrl : srv_host + '/status',
                contentUrlField : 'url',
                contentId : 'app',
                pstorageName : 'app-sync-pstorage'
            }
        }
    ];
});