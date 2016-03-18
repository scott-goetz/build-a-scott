'use strict';

angular.module('buildScott', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/build");

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

      .state('build', {
        url: "/build",
        templateUrl: "partials/build.html"
      })

      .state('export', {
        url: "/export",
        templateUrl: "partials/export.html"
      })
  }]);
