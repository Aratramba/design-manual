'use strict';
/* global require, module, console */

var assign = require('object-assign');
var path = require('path');

var generate = require('./lib/generate');
var validate = require('./lib/validate');


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
    contentsFlag: 'contents',
    brandColor: null,
    brandColorContrast: null,
    renderPages: true,
    renderComponents: true,
    renderJS: true,
    renderCSS: true,
    prerenderComponents: true,
    prerender: null,
    onComplete: function() {}
  }, options);

  validate(options);

  options.output = path.resolve(options.output);
  options.pages = path.resolve(options.pages);
  options.components = path.resolve(options.components);
  
  generate.init(options);
}

module.exports = DesignManual;