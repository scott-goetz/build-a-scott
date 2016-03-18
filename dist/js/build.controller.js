'use strict';

angular.module('buildScott')
  .controller('BuildController', ['$scope', '$rootScope', 'BuildService', function ($scope, $rootScope, BuildService) {
    $scope.test = 'test buttz';
    $scope.buttz = 'BUTTZ';

    $scope.allImages = BuildService.getAllImages();
    $scope.imageDimensions = BuildService.getImageDimensions();
    $scope.numberOfPanels = BuildService.getNumberOfPanels();
    $scope.panelHeights = BuildService.getPanelHeights();
    $scope.panelImages = BuildService.getPanelImages();

    $scope.randomize = function() {
      $rootScope.$broadcast('randomizeFace',{});
    };

    $scope.downloadImage = function() {
      $rootScope.$broadcast('downloadImage',{});
    };
  }]);
