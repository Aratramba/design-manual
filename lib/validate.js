'use strict';
/* globals module, require */

var schema = require('validate');

var options = schema({
  output: {
    type: 'string',
    required: true,
    message: 'output option is required'
  },
  forceUpdate: {
    type: 'boolean',
    required: false,
  },
  prerenderComponents: {
    type: 'boolean',
    required: false,
  },
  prerenderPort: {
    type: 'number',
    required: false,
  },
  onComplete: {
    type: 'function',
    required: false,
  },
  pages: {
    type: 'string',
    required: true,
    message: 'pages option is required'
  },
  components: {
    type: 'string',
    required: true,
    message: 'components.json is required'
  },
  meta: {
    domain: {
      type: 'string',
      required: true,
      message: 'meta.domain option is required'
    },
    title: {
      type: 'string',
      required: true,
      message: 'meta.title option is required'
    },
    avatar: {
      type: 'string',
      required: false
    },
    version: {
      type: 'string',
      required: false
    },
  },
  subnav: {
    type: 'array',
    required: false
  },
  headHtml: {
    type: 'string',
    required: false
  },
  bodyHtml: {
    type: 'string',
    required: false
  },
  componentHeadHtml: {
    type: 'string',
    required: false
  },
  componentBodyHtml: {
    type: 'string',
    required: false
  },
  indexPage: {
    type: 'string',
    required: false
  },
  componentsPage: {
    type: 'string',
    required: false
  },
  contentsFlag: {
    type: 'string',
    required: false
  },
  brandColor: {
    type: 'string',
    required: false
  },
  brandColorContrast: {
    type: 'string',
    required: false
  }
});


module.exports = options;