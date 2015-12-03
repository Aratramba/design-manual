'use strict';
/* globals module, require */

var schema = require('validate');

var options = schema({
  output: {
    type: 'string',
    required: true,
    message: 'output option is required'
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
  includeCss: {
    type: 'array',
    required: false
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
  },
  subnav: {
    type: 'array',
    required: false
  },
  headHtml: {
    type: 'string',
    required: false
  },
  footerHtml: {
    type: 'string',
    required: false
  },
  contentsId: {
    type: 'string',
    required: false
  }
});


module.exports = options;