/**
 * Created by my9074 on 16/3/2.
 */
(function () {
    'use strict';
    angular.module('glance.app')
        .controller('EventAppCtrl', EventAppCtrl);

    EventAppCtrl.$inject = ['appservice', '$stateParams', '$rootScope'];

    function EventAppCtrl(appservice, $stateParams, $rootScope) {
        var self = this;

        self.events = [];
        self.pageLength = 20;

        self.appEvent = function () {
            getEvents(1)
        };

        self.setPage = function (pageNo) {
            self.currentPage = pageNo;
        };

        self.pageChanged = function (currentPage) {
            getEvents(currentPage)
        };

        self.appEvent();

        function getEvents(page) {
            appservice.listAppEvents({page: page, per_page: self.pageLength}, $stateParams.cluster_id, $stateParams.app_id).then(function (data) {
                self.events = data.Message;

                self.totalItems = data.Page;
                self.showPagination = (self.totalItems > self.pageLength);
            });
        }
    }
})();