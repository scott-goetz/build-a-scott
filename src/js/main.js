'use strict';

angular.module('buildScott', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/introduction");

        $stateProvider
            .state('introduction', {
                url: "/introduction",
                templateUrl: "partials/introduction.html"
            })

            .state('components', {
                url: "/components",
                templateUrl: "partials/components.html"
            })

            .state('about', {
                url: "/about",
                templateUrl: "partials/about.html"
            })

            .state('result', {
                url: "/result",
                templateUrl: "partials/result.html"
            })

            .state('export', {
                url: "/export",
                templateUrl: "partials/export.html"
            })

            .state('state2.list', {
                url: "/list",
                templateUrl: "partials/state2.list.html",
                controller: function($scope) {
                    $scope.things = ["A", "Set", "Of", "Things"];
                }
            });
    }])

    .controller('TestController', function() {

    });