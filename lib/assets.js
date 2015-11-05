'use strict';
/* global require, module, console */

var exec = require('child_process').exec;
var mkdirp = require('mkdirp');

/**
 * Generate js/css
 */

function generate(options){
  css(options);
  js(options);
}


/**
 * Generate js
 */

function js(options, cb){
  mkdirp.sync(options.output);

  // compile js
  exec('npm run template-js-browserify -- -o '+ options.output +'/app.min.js', function(error){
    if(error !== null){
      console.log(error);
    }else{
      console.log('Generated template js');
    }
    if(cb) cb();
  });
}


/**
 * Generate css
 */

function css(options, cb){
  mkdirp.sync(options.output);

  // compile sass
  exec('npm run template-css-sass -- -o '+ options.output +'/all.min.css', function(error, stdout, stderr){
    if(stderr !== ''){
      console.log(stderr);
    }else{
      console.log('Generated template css');
    }
    if(cb) cb();
  });
}

module.exports = {
  js: js,
  css: css,
  generate: generate
};