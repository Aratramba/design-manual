'use strict';
/* global console, require, process */

// var argv = require('minimist')(process.argv.slice(2));
var DesignManual = require('./index');

// console.log(argv);

new DesignManual();








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