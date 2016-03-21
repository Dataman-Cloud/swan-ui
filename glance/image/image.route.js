(function () {
    'use strict';
    angular.module('glance.image')
        .config(route);

    route.$inject = ['$stateProvider'];

    function route($stateProvider) {

        $stateProvider
            .state('imageList', {
                url: '/image',
                views: {
                    '': {
                        templateUrl: '/image/list/list.html',
                        controller: 'ImageListCtrl as imageListCtrl'
                    }
                }
            })
            .state('imageCreate', {
                url: '/image/create',
                views: {
                    '': {
                        templateUrl: '/image/create/create.html',
                        controller: 'ImageCreateCtrl as imageCreateCtrl'
                    }
                }
            })
            .state('imageDetail', {
                url: '/image/detail/:projectId',
                abstract: true,
                views: {
                    '': {
                        templateUrl: '/image/detail/detail.html',
                        controller: 'ImageDetailCtrl as imageDetailCtrl'
                    }
                },
                resolve: {
                    project: getProject
                }
            })
            .state('imageDetail.version', {
                url: '/version',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/image/detail/version.html',
                        controller: 'ImageDetailVersionCtrl as imageDetailVersionCtrl'
                    }
                }
            })
            .state('imageDetail.brief', {
                url: '/brief',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/image/detail/brief.html',
                        controller: 'ImageDetailBriefCtrl as imageDetailBriefCtrl'
                    }
                }
            })
            .state('imageDetail.setting', {
                url: '/setting',
                views: {
                    'imageDetailTab': {
                        templateUrl: '/image/detail/setting.html',
                        controller: 'ImageDetailSettingCtrl as imageDetailSettingCtrl'
                    }
                }
            });

    }

    getProject.$inject = ['$stateParams', 'imageBackend'];
    function getProject($stateParams, imageBackend) {
        return imageBackend.getProject($stateParams.projectId);
    }
})();
