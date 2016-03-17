'use strict';
/* global require, module, console */

var assign = require('object-assign');
var path = require('path');

var pages = require('./lib/pages');
var assets = require('./lib/assets');
var schema = require('./lib/validate');


/**
 * Set everything up
 */

function DesignManual(options){
  
  // options
  options = assign({
    output: null,
    pages: null,
    components: null,
    websiteCss: [],
    meta: {
      domain: '',
      title: '',
      avatar: ''
    },
    subnav: [],
    headHtml: '',
    bodyHtml: '',
    componentHeadHtml: '',
    componentBodyHtml: '',
    contentsId: '#contents',
    primaryColor: null
  }, options);

  var errors = schema.validate(options);
  if(errors.length){
    console.log('Error creating Design Manual');
    errors.forEach(function(err){
      console.log('-', err.message);
    });
    return;
  }

  options.output = path.resolve(options.output);
  options.pages = path.resolve(options.pages);
  options.components = path.resolve(options.components);
  
  assets.generate(options);
  pages.generate(options);
}


module.exports = DesignManual;