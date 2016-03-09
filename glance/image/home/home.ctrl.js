(function () {
    'use strict';
    angular.module('glance.image')
        .controller('ImageHomeCtrl', ImageHomeCtrl);

    ImageHomeCtrl.$inject = ['$rootScope', 'imageservice', 'imageCurd'];

    function ImageHomeCtrl($rootScope, imageservice, imageCurd) {
        var self = this;

        $rootScope.show = 'image';

        listProjets();

        self.deleteProject = function (projectId) {
            imageCurd.deleteProjet(projectId)
        };

        function listProjets() {
            imageservice.listProjects().then(function (data) {
                self.projects = data;
            })
        }


    }
})();