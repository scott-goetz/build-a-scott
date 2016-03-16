'use strict';

angular.module('buildScott')
  .directive('scottMachine', function ($window) {
    return {
      restrict: 'E',
      template: '<canvas></canvas>',
      link: function ($scope, $element, $attr) {
        var windowElement = angular.element($window);

        var Container = PIXI.Container,
            autoDetectRenderer = PIXI.autoDetectRenderer,
            loader = PIXI.loader,
            resources = loader.resources,
            Sprite = PIXI.Sprite,
            Graphics = PIXI.Graphics;

        var stage = new Container(),
            renderer = autoDetectRenderer($element.width(), $element.height(), {
              view: document.getElementById($attr.id).getElementsByTagName('canvas')[0],
              antialiasing: false,
              autoResize: true,
              transparent: false,
              resolution: 1
            });

        var slots = [];

        var elementWidth = $element.width(),
            elementHeight = $element.height(),
            offsetX = 0;

        var init = function() {
          // Load all Scott images
          for (var key in $scope.allImages) {
            loader.add(key, $scope.allImages[key]);
          }

          // Initialize load
          loader.load(setup);
        };


        var setup = function() {
          console.log('====================');
          console.log('setup');

          var panelCount = 0,
              panelPosY = 0;

          console.log('Image Original Size:', $scope.imageDimensions);

          var scaleDiff = $element.height() / $scope.imageDimensions.height;

          console.log('==========');

          for (var panel in $scope.panelImages) {
            var currPanelImages = $scope.panelImages[panel],
                panelHeightPercent = $scope.panelHeights[panelCount] / $scope.imageDimensions.height,
                panelHeight = $element.height() * panelHeightPercent,
                panelWidth = $element.width(),
                imageCount = 0;

            // Container for current slot sprites
            slots[panelCount] = new Container();
            slots[panelCount].height = panelHeight;
            slots[panelCount].x = 0;
            slots[panelCount].y = panelPosY;

            for (var key in currPanelImages) {
              var spriteTexture = resources[key].texture;

              // Add container
              //var spriteContainer = new Container();
              //spriteContainer.width = panelWidth;
              //spriteContainer.height = panelHeight;
              //spriteContainer.x = panelWidth * imageCount; // TODO: Figure out slide by slide spacing
              //spriteContainer.y = 0;

              // Add, position and scale image
              var currSprite = new Sprite(spriteTexture);
              currSprite.scale.x = currSprite.scale.y = scaleDiff;
              //currSprite.x = -(($scope.imageDimensions.width * scaleDiff) / 2) + (panelWidth / 2);
              currSprite.x = ($scope.imageDimensions.width * scaleDiff) * imageCount;
              currSprite.y = 0;

              //spriteContainer.addChild(currSprite);
              slots[panelCount].addChild(currSprite);

              imageCount++;
            }

            stage.addChild(slots[panelCount]);

            panelPosY = panelPosY + panelHeight;
            panelCount++;
          }

          draw();
          requestAnimationFrame(animate);
        };


        var draw = function() {
          console.log('====================');
          console.log('draw');

          renderer.render(stage);

          console.log('stage: ', stage.width, stage.height);

          events();
        };


        var events = function() {
          // TODO: Get animation/drag events working
          for (var i = 0; i < slots.length; i++) {
            var currSlot = slots[i];

            currSlot.interactive = true;

            currSlot.mousedown = currSlot.touchstart = function (e) {
              this.dragging = true;

              this.mousePressPoint = [
                e.data.getLocalPosition(this.parent).x -
                this.position.x,
                e.data.getLocalPosition(this.parent).y -
                this.position.y
              ];

              console.log('mousedown');
            };

            currSlot.mouseup = currSlot.mouseupoutside =
              currSlot.touchend = currSlot.touchendoutside = function (data) {
                this.dragging = false;

                positionFaces(this);

                console.log('mouseup');
              };

            currSlot.mousemove = currSlot.touchmove = function (e) {
              if (this.dragging) {
                //console.log(this);
                var position = e.data.getLocalPosition(this.parent);
                this.position.x = position.x - this.mousePressPoint[0];
                //this.position.y = position.y - this.mousePressPoint[1];
              }
            };

            //stage.mousedown = stage.touchstart = function (data) {
            //  console.log('mouse down');
            //
            //  stage.dragging = true;
            //};
          }

          windowElement.on('resize', resize).trigger('resize');
        };


        var positionFaces = function(blah) {
          var scaleDiff = $element.height() / $scope.imageDimensions.height;

          console.log(Math.round(Math.random() * 7));

          TweenMax.to(blah, 0.3, {
            x: -((Math.round(Math.random() * 7) * ($scope.imageDimensions.width * scaleDiff)) + offsetX)
            //x: -offsetX
          });
        };


        var scale = function () {
          console.log('=============');
          console.log('scale');

          var scaleDiff = $element.height() / $scope.imageDimensions.height;

          elementWidth = $element.width();
          elementHeight = $element.height();
          offsetX = (($scope.imageDimensions.width * scaleDiff) / 2) - (elementWidth / 2);

          for (var i = 0; i < slots.length; i++) {
            //slots[i].tileScale.x = slots[i].tileScale.y = scaleDiff;
          }
        };


        var resize = function() {
          console.log('=============');
          console.log('resize');


          // TODO: Figure out resizing, should be a method you can use in the setup as well
          var scaleDiff = $element.height() / $scope.imageDimensions.height;

          var ratio = Math.min(windowElement.innerWidth/$scope.imageDimensions.width, windowElement.innerHeight/$scope.imageDimensions.height);

          // Scale the view appropriately to fill that dimension
          //stage.scale.x = stage.scale.y = scaleDiff;

          // Update the renderer dimensions
          //renderer.resize(
          //  Math.ceil($scope.imageDimensions.width * ratio),
          //  Math.ceil($scope.imageDimensions.height * ratio)
          //);

          console.log(renderer);

          scale();

          console.log('xxxxxxxxxxxx')


        };


        var animate = function() {
          requestAnimationFrame(animate);
          renderer.render(stage);
        };

        init();
      }
    }
  });
