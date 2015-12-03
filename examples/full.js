'use strict';
/* global require */

var rimraf = require('rimraf');

rimraf.sync('httpdocs/');

var DesignManual = require('../index');

new DesignManual({
  output: 'httpdocs/',
  pages: 'test/fixtures/pages/',
  components: 'test/fixtures/data/components.json',
  includeCss: ['test/fixtures/assets/style1.css', 'test/fixtures/assets/style2.css'],
  meta: {
    domain: 'website.com',
    title: 'Style Guide',
    avatar: 'http://placehold.it/80x80'
  },
  subnav: [
    {
      domain: 'google.com',
      title: 'Title',
      href: 'http://www.google.com',
      avatar: 'http://placehold.it/80x80'
    },
    {
      domain: 'google.com',
      title: 'Title',
      href: 'http://www.google.com',
      avatar: 'http://placehold.it/80x80'
    }
  ],
  headHtml: '<script>console.log("im in the head");</script>',
  footerHtml: '<script>console.log("im in the footer");</script>',
  contentsId: '#contents'
});