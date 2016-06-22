(function () {
    'use strict';
    angular.module('glance.app')
        .controller('AppsTableCtrl', AppsTableCtrl);

    /* @ngInject */
    function AppsTableCtrl(clusters, groups, status, mdTable, $stateParams, $scope, timing, $q, apps, $state, utils, appservice, userBackend, target) {
        var self = this;
        self.targets = target;
        var appListReloadInterval = 5000;
        self.clusterInforMap = listClusterMap(clusters);
        if(self.targets === 'my') {
            self.table = mdTable.createTable('app.list.my');
            self.applist = apps.App;
            self.count = apps.Count;
            self.appListStatus = status;
            self.filter = $stateParams.keywords;

            myActivate();
        } else {
            self.table = mdTable.createTable('app.list.group');
            self.appListStatus = status;

            self.searchForm = {};
            self.clusters = [];
            self.groups = [];
            self.applist = apps.App;
            self.count = apps.Count;
            self.searchForm.keywords = $stateParams.keywords;
            self.APP_STATUS = APP_STATUS;
            self.groupUserMap = {};


            self.search = search;
            self.groupChange = groupChange;

            groupActivate();
        }






        function myActivate() {
            timing.start($scope, myReloadApps, appListReloadInterval)
        }

        /*
         获取集群名
         */
        function listClusterMap(clusters) {
            var clusterMap = {};
            angular.forEach(clusters, function (cluster) {
                clusterMap[cluster.id] = {
                    name:cluster.name,
                    status:cluster.status
                };
            });
            return clusterMap;
        }


        function myReloadApps() {
            var deferred = $q.defer();
            appservice.listApps(utils.encodeQueryParams($stateParams), '')
                .then(function (data) {
                    self.applist = data.App;
                    self.count = data.Count;
                    appservice.listAppsStatus()
                        .then(function (data) {
                            self.appListStatus = data;
                            deferred.resolve();
                        })
                });
            return deferred.promise;

        }

        
        function groupActivate() {
            if($stateParams.groupId){
                getGroupIdUsers();
            }
            angular.forEach(groups.groups, function (group) {
                if (group.role.id === 1) {
                    self.groups.push(group);
                }
            });

            if ($stateParams.groupId && $stateParams.clusterId) {
                initToolbar();
                timing.start($scope, groupReloadApps, appListReloadInterval)

            }
        }

        function groupReloadApps() {
            var deferred = $q.defer();
            appservice.listClusterApps(encodeGroupAppsParams($stateParams), self.searchForm.clusterId, '')
                .then(function(data){
                    self.applist = data.App;
                    self.count = data.Count;

                    appservice.listAppsStatus({cid: self.searchForm.clusterId})
                        .then(function(data){
                            self.appListStatus = data;
                            deferred.resolve();
                        })
                });
            return deferred.promise;
        }
        function initToolbar() {
            self.searchForm.groupId = parseInt($stateParams.groupId);

            groupChange();

            self.searchForm.clusterId = parseInt($stateParams.clusterId);

        }

        function groupChange() {
            self.clusters = [];
            angular.forEach(clusters, function (cluster) {
                if (cluster.group_id === self.searchForm.groupId) {
                    self.clusters.push(cluster);
                }
            })
        }

        function search() {
            $state.go('app.list.group', {
                page: $stateParams.page,
                per_page: $stateParams.per_page,
                order: $stateParams.order,
                sort_by: $stateParams.sort_by,
                keywords: self.searchForm.keywords,
                clusterId: self.searchForm.clusterId,
                groupId: self.searchForm.groupId
            })
        }




        function encodeGroupAppsParams($stateParams) {
            var params = utils.encodeQueryParams($stateParams);

            if (self.searchForm.clusterId) {
                params.clusterId = self.searchForm.clusterId;
            }

            if ($stateParams.groupId) {
                params.groupId = self.searchForm.groupId;
            }

            return params;
        }

        function getGroupIdUsers(){
            userBackend.listGroupUser($stateParams.groupId)
                .then(function(data){
                    if(data && data.length){
                        angular.forEach(data, function(item, index){
                            self.groupUserMap[item.user.id] = item.user.name
                        });
                    }
                })
        }
    }
})();