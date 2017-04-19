'use strict';
/* global require, module, console */

var assign = require('object-assign');
var path = require('path');

var generate = require('./lib/generate');
var schema = require('./lib/validate');


/**
 * Set everything up
 */

function DesignManual(options){
  
  // options
  options = assign({
    forceUpdate: false,
    output: null,
    pages: null,
    components: null,
    meta: {
      domain: '',
      title: '',
      avatar: '',
      version: ''
    },
    subnav: [],
    headHtml: '',
    bodyHtml: '',
    componentHeadHtml: '',
    componentBodyHtml: '',
    indexPage: 'Index.md',
    componentsPage: 'Components.md',
    contentsFlag: 'contents',
    brandColor: null,
    brandColorContrast: null,
    onComplete: function() {}
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
  
  generate.init(options);
}


module.exports = DesignManual;