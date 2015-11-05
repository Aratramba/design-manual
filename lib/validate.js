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
    required: false
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



// options = assign({
//   output: './httpdocs/',
//   pages: './test/fixtures/pages/',
//   components: './test/fixtures/data/components.json',
//   includeCss: ['./test/fixtures/assets/style1.css', './test/fixtures/assets/style2.css'],
//   meta: {
//     domain: 'website.com',
//     title: 'Style Guide',
//     avatar: 'http://placehold.it/80x80'
//   },
//   subnav: [
//     {
//       domain: 'google.com',
//       title: 'Title',
//       href: 'http://www.google.com',
//       avatar: 'http://placehold.it/80x80'
//     },
//     {
//       domain: 'google.com',
//       title: 'Title',
//       href: 'http://www.google.com',
//       avatar: 'http://placehold.it/80x80'
//     }
//   ],
//   headHtml: multiline(function(){/*
//     <script>
//       console.log('im in the head');
//     </script>
//   */}),
//   footerHtml: multiline(function(){/*
//     <script>
//       console.log('im in the footer');
//     </script>
//   */}),
//   contentsId: '#contents'
// }, options);