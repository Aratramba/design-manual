'use strict';
/* global require, module, console */

var exec = require('child_process').exec;
var mkdirp = require('mkdirp');


/**
 * Generate js / css
 */

function assets(options){
  mkdirp.sync(options.output);

  // compile js
  exec('npm run template-js-browserify -- -o '+ options.output +'/app.min.js', function(error){
    if(error !== null){
      console.log(error);
    }else{
      console.log('Generated template js');
    }
  });

  // compile sass
  exec('npm run template-css-sass -- -o '+ options.output +'/all.min.css', function(error, stdout, stderr){

    if(stderr !== ''){
      console.log(stderr);
    }else{
      console.log('Generated template css');
    }
  });

}

module.exports = assets;