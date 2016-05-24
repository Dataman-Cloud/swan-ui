/**
 * Created by my9074 on 16/2/23.
 */
(function () {
    'use strict';
    angular.module('glance.auth')
        .controller('RegisterCtrl', RegisterCtrl);

    /* @ngInject */
    function RegisterCtrl(authBackend, $state, $rootScope, emailService, $scope) {
        var self = this;
        self.registerDataMan = function () {
            authBackend.register(self.register, $scope.staticForm).then(function (data) {
                $rootScope.emailHref = emailService.emailUrl(self.register.email);
                $state.go('registerSuccess');
            }, function (res) {

            })
        }
    }
})();