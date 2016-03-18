'use strict';

angular.module('buildScott')
  .factory('BuildService', [function() {
    var imageRoot = '/media/images/scott/',
        imageFormat = 'jpg',
        imageDimensions = {
          width: 1280,
          height: 730
        },
        panelHeights = [
          181,
          159,
          95,
          95,
          200
        ],
        scottsList = [
          'goetz',
          'hughes',
          'ingalls',
          'king',
          'lygo',
          'malo',
          'sinclair'
        ];

    // Object to contain all images for each panel
    var scottPanels = {};

    // Temp array to preload images
    var scottImages = {};


    var generateScottImages = function(version) {
      for (var i = 0; i < scottsList.length; i++) {
        var currScott = scottsList[i];

        for (var j = 0; j < panelHeights.length; j++) {
          var currScottId = currScott + '-' + zeroPad((j + 1), 2) + version,
              currScottPanelPath = imageRoot + currScottId + '.' + imageFormat;

          // Create an array for each panel
          if (!(j in scottPanels)) {
            scottPanels[j] = {};
          }

          // Store scott images
          scottPanels[j][currScottId] = currScottPanelPath;
          scottImages[currScottId] = currScottPanelPath;
        }
      }
    };


    var getAllImages = function() {
      return scottImages;
    };


    var getImageDimensions = function() {
      return imageDimensions;
    };


    var getNumberOfPanels = function() {
      return panelHeights.length;
    };


    var getPanelHeights = function() {
      return panelHeights;
    };


    var getPanelImages = function() {
      return scottPanels;
    };


    var shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };


    var zeroPad = function(num, places) {
      var zero = places - num.toString().length + 1;
      return Array(+(zero > 0 && zero)).join('0') + num;
    };


    /**
     * Public Methods
     */
    var api = {
      getAllImages: getAllImages,
      getImageDimensions: getImageDimensions,
      getNumberOfPanels: getNumberOfPanels,
      getPanelHeights: getPanelHeights,
      getPanelImages: getPanelImages
    };


    /**
     * Service initialization
     */
    (function() {
      // Randomize our scotts and gather all the images
      shuffle(scottsList);
      generateScottImages('a');
    })();

    return api;
  }]);
