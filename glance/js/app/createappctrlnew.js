glanceApp.controller("createappCtrlNew", createappCtrl);

createappCtrl.$inject = ['$scope', '$state', 'glanceHttp'];

function createappCtrl($scope, $state, glanceHttp) {
    $scope.step = "stepone";

    $scope.cpuOptions = {
        min: 0.1,
        max: 2,
        step: 0.1,
        precision: 2,
        orientation: 'horizontal',
        handle: 'round',
        tooltip: 'always',
        tooltipseparator: ':',
        tooltipsplit: false,
        enabled: true,
        naturalarrowkeys: false,
        range: false,
        reversed: false
    };

    $scope.memOptions = {
        min: 16,
        max: 4096,
        step: 16,
        precision: 2,
        orientation: 'horizontal',
        handle: 'round',
        tooltip: 'always',
        tooltipseparator: ':',
        tooltipsplit: false,
        enabled: true,
        naturalarrowkeys: false,
        range: false,
        reversed: false
    };

    $scope.cpuSize = 0.1;
    $scope.memSize = 16;
    $scope.containerNum = 1;


    $scope.dynamicData = {
        "createEnv": [{id: 'choice1'}],
        "createPort": [{id: 'choice1'}],

        "addNewChoice": function (conditions) {
            var newItemNo;
            var creatLength = $scope.dynamicData[conditions].length;
            var creatData = $scope.dynamicData[conditions];

            if(conditions === 'createEnv'){
                if (creatData[creatLength - 1].key &&
                    creatData[creatLength - 1].value) {
                    newItemNo = creatLength + 1;
                    creatData.push({'id': 'choice' + newItemNo});
                } else {
                    alert("输入框有空值,不能继续添加");
                }
            }else if(conditions === 'createPort'){
                if (creatData[creatLength - 1].value) {
                    newItemNo = creatLength + 1;
                    creatData.push({'id': 'choice' + newItemNo});
                } else {
                    alert("输入框有空值,不能继续添加");
                }
            }

        },
        "removeChoice": function (conditions) {
            var creatLength = $scope.dynamicData[conditions].length;
            var creatData = $scope.dynamicData[conditions];

            if (creatLength >= 2) {
                creatData.pop();
            } else {
                alert("不能删除");
            }
        },

        "subNumber": function (conditions) {

            var creatData = $scope.dynamicData[conditions];

            if (conditions === 'createEnv') {
                $scope.deployinfo.envs = {};
                angular.forEach(creatData, function (value) {
                    $scope.deployinfo.envs[value.key] = value.value;
                });
            } else if (conditions === 'createPort') {
                //$scope.deployinfo.containerPortsInfo = {
                //    "inner": [],
                //    "outer": []
                //};

                $scope.deployinfo.containerPortsInfo = [];

                angular.forEach(creatData, function (value) {
                    $scope.deployinfo.containerPortsInfo.push(value.value);

                });

                //angular.forEach(creatData, function (value) {
                //    if(value.key === 'inner'){
                //        $scope.deployinfo.containerPortsInfo.inner.push(value.value);
                //    }else if(value.key === 'outer'){
                //        $scope.deployinfo.containerPortsInfo.outer.push(value.value);
                //    }
                //
                //
                //});
            }
        }
    };

    $scope.deployApp = function () {
        if ($scope.dynamicData.createPort[0].value)$scope.dynamicData.subNumber('createPort');
        if ($scope.dynamicData.createEnv[0].key && $scope.dynamicData.createEnv[0].value)$scope.dynamicData.subNumber('createEnv');
        if ($scope.cmdInput) {
            $scope.deployinfo.cmd = $scope.cmdInput;
        } else {
            delete $scope.deployinfo.cmd;
        }
        $scope.deployinfo.clusterId = $scope.clusterid.toString();
        $scope.deployinfo.containerNum = $scope.containerNum.toString();
        $scope.deployinfo.containerCpuSize = $scope.cpuSize;
        $scope.deployinfo.containerMemSize = $scope.memSize;
        glanceHttp.ajaxPost(['app.deploy'], $scope.deployinfo, function (data) {
            $state.go('app.appdetail.instance', {appId: data.data});
        }, undefined, null, function (data) {
            alert("创建应用失败: " + data.errors);
        });
    };
}