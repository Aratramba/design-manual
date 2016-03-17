'use strict';
/* global require, module, console, __dirname */

var fs = require('fs');
var mkdirp = require('mkdirp');
var sass = require('node-sass');
var CleanCSS = require('clean-css');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');

var browserify = require('browserify');

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

  var b = browserify();
  b.add(__dirname + '/../template/scripts/index.js');
  b.transform({
    global: true
  }, 'uglifyify');
  b.bundle(function(err, buf) {
    if (err) {
      console.log(err);
      throw err;
    }
    fs.writeFile(options.output +'/app.min.js', buf, function(err) {
      if (err) throw err;
      console.log('Generated template js');
      if(cb) cb();
    });
  });
}


/**
 * Generate css
 */

function css(options, cb){
  mkdirp.sync(options.output);

  sass.render({
    file: __dirname + '/../template/styles/all.scss',
    outFile: options.output +'/all.min.css',
  }, function(err, result) { 
    if (err) {
      console.log(err);
      throw err;
    }

    postcss([ autoprefixer ]).process(result.css).then(function (result) {
      var cleaned = new CleanCSS().minify(result.css);
      fs.writeFile(options.output +'/all.min.css', cleaned.styles, function(err) {
        if(!err){
          console.log('Generated template css');
          if(cb) cb();
        } else {
          console.log(err);
          throw err;
        }
      });
    });
  });
}

module.exports = {
  js: js,
  css: css,
  generate: generate
};