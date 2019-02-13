'use strict';

angular.module('buildScott').directive('scottMachine', function($window, $state) {
  return {
    restrict: 'E',
    template: '<canvas></canvas>',
    link: function($scope, $element, $attr) {
      var canvasElement = document.getElementById($attr.id).getElementsByTagName('canvas'),
        windowElement = angular.element($window);

      var Container = PIXI.Container,
        autoDetectRenderer = PIXI.autoDetectRenderer,
        loader = PIXI.loader,
        resources = loader.resources,
        Sprite = PIXI.Sprite;

      var stage = new Container(),
        renderer = autoDetectRenderer($element.width(), $element.height(), {
          view: canvasElement[0],
          antialiasing: false,
          autoResize: true,
          preserveDrawingBuffer: true, // Need this for saving to image
          resolution: 1,
          transparent: false
        });

      var slots = [],
        currSlotImages = {};

      var elementWidth = $element.width(),
        elementHeight = $element.height(),
        scaleDiff = elementHeight / $scope.imageDimensions.height,
        newImageWidth = $scope.imageDimensions.width * scaleDiff,
        newImageHeight = elementHeight,
        panelLength = Object.keys($scope.panelImages).length,
        offsetX = 0;

      var options = {
        dragThreshold: 90,
        randomizeTimerPause: 5000
      };

      /**
       * Init Scott Machine.
       */
      var init = function() {
        // Load all Scott images
        for (var key in $scope.allImages) {
          loader.add(key, $scope.allImages[key]);
        }

        // Initialize load
        loader.load(setup);
      };

      /**
       * Attach events to Scott Machine
       */
      var events = function() {
        // Face panel drag functionality
        for (var i = 0; i < slots.length; i++) {
          var currSlot = slots[i],
            initialX = 0;

          currSlot.interactive = true;

          currSlot.mousedown = currSlot.touchstart = function(e) {
            this.dragging = true;

            this.mousePressPoint = [
              e.data.getLocalPosition(this.parent).x - this.position.x,
              e.data.getLocalPosition(this.parent).y - this.position.y
            ];

            initialX = this.position.x;
          };

          currSlot.mouseup = currSlot.mouseupoutside = currSlot.touchend = currSlot.touchendoutside = function(data) {
            if (this.dragging) {
              // Update panel indexes
              if (this.position.x > initialX + options.dragThreshold && currSlotImages[this.index] !== 0) {
                // Decrease panel current index
                currSlotImages[this.index]--;
              } else if (
                this.position.x < initialX - options.dragThreshold &&
                currSlotImages[this.index] <= Object.keys(currSlotImages).length
              ) {
                // Increase panel current index
                currSlotImages[this.index]++;
              }

              // Reposition faces
              positionFaces(this, currSlotImages[this.index]);
            }

            // Reset
            this.dragging = false;
            initialX = 0;
          };

          currSlot.mousemove = currSlot.touchmove = function(e) {
            if (this.dragging) {
              var position = e.data.getLocalPosition(this.parent);

              this.position.x = position.x - this.mousePressPoint[0];
              //this.position.y = position.y - this.mousePressPoint[1];
            }
          };
        }

        // Determine whether to run in auto mode
        if ($state.is('demo')) {
          randomizeTimer();
        }

        // Listen for controller calls
        $scope.$on('randomizeFace', randomize);
        $scope.$on('downloadImage', convertToImage);
        $scope.$on('reflow', resize);

        // Window events
        windowElement.on('resize', $.debounce(100, resize));
      };

      /**
       * Create containers/sprites and add them to the stage
       */
      var setup = function() {
        var panelCount = 0,
          panelPosY = 0;

        for (var panel in $scope.panelImages) {
          var currPanelImages = $scope.panelImages[panel],
            panelHeightPercent = $scope.panelHeights[panelCount] / $scope.imageDimensions.height,
            panelHeight = $element.height() * panelHeightPercent,
            imageCount = 0;

          // Container for current slot sprites
          slots[panelCount] = new Container();
          slots[panelCount].x = 0;
          slots[panelCount].index = panelCount; // Necessary for dragging

          for (var key in currPanelImages) {
            var spriteTexture = resources[key].texture;

            // Add, position and scale image
            var currSprite = new Sprite(spriteTexture);
            //currSprite.scale.x = currSprite.scale.y = scaleDiff;
            //currSprite.x = newImageWidth * imageCount;
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

      /**
       * Draw stage on canvas and set initial images position
       */
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

      /**
       * Rescale/reposition slots
       */
      var scale = function() {
        var slotPosY = 0;

        for (var i = 0; i < slots.length; i++) {
          var currSlot = slots[i],
            slotHeightPercent = $scope.panelHeights[i] / $scope.imageDimensions.height,
            slotHeight = elementHeight * slotHeightPercent;

          currSlot.y = slotPosY;

          for (var j = 0; j < currSlot.children.length; j++) {
            var currSprite = currSlot.children[j];

            currSprite.scale.x = currSprite.scale.y = scaleDiff;
            currSprite.x = newImageWidth * j;
          }

          slotPosY = slotPosY + slotHeight;

          positionFaces(currSlot, currSlotImages[i]);
        }
      };

      /**
       * Window resize event. Set necessary variables based on new dimensions.
       */
      var resize = function() {
        elementWidth = $element.width();
        elementHeight = $element.height();
        scaleDiff = elementHeight / $scope.imageDimensions.height;
        newImageWidth = $scope.imageDimensions.width * scaleDiff;
        newImageHeight = elementHeight;
        offsetX = newImageWidth / 2 - elementWidth / 2;

        renderer.resize(elementWidth, elementHeight);

        scale();
      };

      /**
       * Animate slot to current/new image index
       *
       * @param slot
       * @param index
       */
      var positionFaces = function(slot, index) {
        TweenMax.to(slot, 0.3, {
          x: -(index * newImageWidth + offsetX)
        });
      };

      /**
       * Randomly select an image in each panel
       */
      var randomize = function() {
        for (var i = 0; i < slots.length; i++) {
          var randomImageIndex = Math.round(Math.random() * panelLength);

          currSlotImages[i] = randomImageIndex;

          positionFaces(slots[i], randomImageIndex);
        }
      };

      /**
       * Trigger randomize every so often
       */
      var randomizeTimer = function() {
        setTimeout(function() {
          randomize();
          randomizeTimer();
        }, options.randomizeTimerPause);
      };

      /**
       * Start canvas animation loop.
       */
      var animate = function() {
        requestAnimationFrame(animate);
        renderer.render(stage);
      };

      /**
       * Convert Canvas drawing to image
       */
      var convertToImage = function() {
        canvasElement[0].toBlob(function(blob) {
          saveAs(blob, 'my-scott.png');
        });
      };

      init();
    }
  };
});
