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

        var slots = [],
            currSlotImages = {};

        var elementWidth = $element.width(),
            elementHeight = $element.height(),
            scaleDiff = elementHeight / $scope.imageDimensions.height,
            newImageWidth = $scope.imageDimensions.width * scaleDiff,
            newImageHeight = elementHeight,
            panelLength = Object.keys($scope.panelImages).length,
            dragThreshold = 75,
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
          var panelCount = 0,
              panelPosY = 0;

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
            slots[panelCount].index = panelCount; // Needed for dragging

            for (var key in currPanelImages) {
              var spriteTexture = resources[key].texture;

              // Add, position and scale image
              var currSprite = new Sprite(spriteTexture);
              currSprite.scale.x = currSprite.scale.y = scaleDiff;
              currSprite.x = newImageWidth * imageCount;
              currSprite.y = 0;

              slots[panelCount].addChild(currSprite);

              imageCount++;
            }

            stage.addChild(slots[panelCount]);

            panelPosY = panelPosY + panelHeight;
            panelCount++;

            // Begin storing current indexes
            currSlotImages[panel] = 0;
          }

          draw();
          requestAnimationFrame(animate);
        };


        var draw = function() {
          renderer.render(stage);

          // Ensure we set window size vars
          resize();

          // Set initial image position
          for (var i = 0; i < slots.length; i++) {
            TweenMax.set(slots[i], {
              x: -offsetX
            });
          }

          events();
        };


        var events = function() {
          // Face panel drag functionality
          for (var i = 0; i < slots.length; i++) {
            var currSlot = slots[i],
                initialX = 0;

            currSlot.interactive = true;

            currSlot.mousedown = currSlot.touchstart = function (e) {
              this.dragging = true;

              this.mousePressPoint = [
                e.data.getLocalPosition(this.parent).x -
                this.position.x,
                e.data.getLocalPosition(this.parent).y -
                this.position.y
              ];

              initialX = this.position.x;
            };

            currSlot.mouseup = currSlot.mouseupoutside =
              currSlot.touchend = currSlot.touchendoutside = function (data) {
                this.dragging = false;

                // Update panel indexes
                if (this.position.x > (initialX + dragThreshold)) {
                  // Decrease panel current index
                  currSlotImages[this.index]--;
                } else if (this.position.x < (initialX - dragThreshold)) {
                  // Increase panel current index
                  currSlotImages[this.index]++;
                }

                // Reposition faces
                positionFaces(this, currSlotImages[this.index]);

                // Reset
                initialX = 0;
              };

            currSlot.mousemove = currSlot.touchmove = function (e) {
              if (this.dragging) {
                var position = e.data.getLocalPosition(this.parent);

                console.log(newImageWidth - elementWidth);
                console.log(position);
                console.log((elementWidth - newImageWidth) - position.x);

                this.position.x = position.x - this.mousePressPoint[0];
                //this.position.y = position.y - this.mousePressPoint[1];
              }
            };
          }

          $scope.$on('randomizeFace', randomize);

          windowElement.on('resize', resize);
        };


        var randomize = function() {
          for (var i = 0; i < slots.length; i++) {
            var randomImageIndex = Math.round(Math.random() * panelLength);

            currSlotImages[i] = randomImageIndex;

            positionFaces(slots[i], randomImageIndex);
          }
        };


        var positionFaces = function(slot, index) {
          TweenMax.to(slot, 0.3, {
            x: -((index * newImageWidth) + offsetX)
          });
        };


        var scale = function () {
          console.log('=============');
          console.log('scale');

          for (var i = 0; i < slots.length; i++) {
            //slots[i].tileScale.x = slots[i].tileScale.y = scaleDiff;
          }
        };


        var resize = function() {
          console.log('=============');
          console.log('resize');

          elementWidth = $element.width();
          elementHeight = $element.height();
          scaleDiff = elementHeight / $scope.imageDimensions.height;
          offsetX = (newImageWidth / 2) - (elementWidth / 2);

          scale();
        };


        var animate = function() {
          requestAnimationFrame(animate);
          renderer.render(stage);
        };

        init();
      }
    }
  });
