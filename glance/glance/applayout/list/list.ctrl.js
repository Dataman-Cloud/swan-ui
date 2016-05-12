(function () {
    'use strict';
    angular.module('glance.layout')
        .controller('LayoutListCtrl', LayoutListCtrl);


    /* @ngInject */
    function LayoutListCtrl(data, layoutBackend, clusters, layoutCurd, appservice) {
        var self = this;

        self.clusterNameMap = listClusterMap(clusters);
        self.stacks = data.Stacks;
        self.stackTypeText = STACK_STATUS;
        self.APP_STATUS = APP_STATUS;
        self.openFlag = {};
        self.appList = {};

        self.showTableData = showTableData;
        self.delStack = delStack;
        self.stopApp = stopApp;

        function showTableData(clusterId, stackId) {
            if (!self.openFlag[stackId]) {
                layoutBackend.getStack(clusterId, stackId).then(function (data) {
                    self.appList[stackId] = data.applications;
                    appservice.listAppsStatus()
                        .then(function(data){
                            self.appListStatus = data;
                        });
                    self.openFlag[stackId] = true;
                })
            } else {
                self.openFlag[stackId] = false;
                self.appList[stackId] = [];
                self.appListStatus = {}
            }
        }

        function delStack(clusterId, stackId) {
            layoutCurd.deleteStack(clusterId, stackId)
                .then(function (data) {
                    self.stacks = data.Stacks
                })
        }

        function stopApp(clusterId, appId, stackId) {
            layoutCurd.stopApp(clusterId, appId, stackId)
                .then(function (data) {
                    self.appList[stackId] = data.applications;
                })
        }

        /*
         获取集群名
         */
        function listClusterMap(clusters) {
            var clusterNameMap = {};
            angular.forEach(clusters, function (cluster) {
                clusterNameMap[cluster.id] = cluster.name;
            });
            return clusterNameMap
        }

        ///
    }
})();