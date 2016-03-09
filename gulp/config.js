'use strict';

var data = {};

data.scripts = {
	'vendor': [
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/gsap/src/minified/plugins/CSSPlugin.min.js',
		'bower_components/gsap/src/minified/TweenMax.min.js',
		'bower_components/angular/angular.min.js',
		'bower_components/angular-ui-router/release/angular-ui-router.min.js'
	],
	'main': [
		'src/js/main.js'
	]
};

exports.getData = function () {
	return data;	
};