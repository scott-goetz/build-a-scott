'use strict';

angular.module('buildScott', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/build");

    $stateProvider
      .state('introduction', {
        url: "/introduction",
        templateUrl: "partials/introduction.html"
      })

      .state('build', {
        url: "/build",
        templateUrl: "partials/build.html"
      })

      .state('demo', {
        url: "/demo",
        templateUrl: "partials/demo.html"
      })
  }]);
