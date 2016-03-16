'use strict';

angular.module('buildScott')
  .controller('BuildController', ['$scope', 'BuildService', function ($scope, BuildService) {
    $scope.test = 'test buttz';
    $scope.buttz = 'BUTTZ';

    $scope.allImages = BuildService.getAllImages();
    $scope.imageDimensions = BuildService.getImageDimensions();
    $scope.numberOfPanels = BuildService.getNumberOfPanels();
    $scope.panelHeights = BuildService.getPanelHeights();
    $scope.panelImages = BuildService.getPanelImages();
  }]);
