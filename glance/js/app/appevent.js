/**
 * Created by myu on 15-8-17.
 */
glanceApp.controller("appEventCtrl", appEventCtrl);

appEventCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'glanceHttp'];

function appEventCtrl($scope, $rootScope, $stateParams, glanceHttp) {
    $rootScope.appTabFlag = "appEvent";

    $scope.events = [];
    $scope.currentTypeText = {
        ScaleApplication: "应用扩展操作",
        StartApplication: "应用部署操作",
        TASK_RUNNING: "实例正在运行",
        TASK_FINISHED: "实例运行成功",
        TASK_FAILED: "实例启动失败",
        TASK_KILLED: "实例已被杀死",
        TASK_STAGING: "实例启动中",
        TASK_LOST: "实例已经丢失"
    };
    $scope.eventTypeText = {
        status_update_event: "实例状态更新",
        deployment_success: "部署成功",
        deployment_failed: "部署失败",
        deployment_step_success: "部署操作成功",
        deployment_step_failure: "部署操作失败"
    };

    $scope.appEvent = function () {
        glanceHttp.ajaxGet(['metrics.event',{clusterID: $scope.appInfo.clusterId ,appName: $scope.appInfo.name}], function (data) {
            $scope.events = data.data;
        });
    };

    $scope.getAppInfoPromise.then($scope.appEvent);
}