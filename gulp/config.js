'use strict';

var data = {};

data.scripts = {
	'vendor': [
		'src/js/vendor/jquery/dist/jquery.min.js',
		'src/js/vendor/gsap/src/minified/plugins/CSSPlugin.min.js',
		'src/js/vendor/gsap/src/minified/TweenMax.min.js'
	],
	'main': [
		'src/js/main.js'
	]
};

exports.getData = function () {
	return data;	
};