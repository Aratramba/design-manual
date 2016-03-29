'use strict';
/* global require */

// var rimraf = require('rimraf');
// rimraf.sync('httpdocs/*');

var DesignManual = require('../index');

new DesignManual({
  output: 'httpdocs/',
  pages: 'test/fixtures/pages/',
  components: 'test/fixtures/data/components.json',
  websiteCss: ['test/fixtures/assets/style1.css', 'test/fixtures/assets/style2.css'],
  meta: {
    domain: 'website.com',
    title: 'Style Guide',
    avatar: 'http://placehold.it/100x50'
  },
  subnav: [
    {
      domain: 'google.com',
      title: 'Title',
      href: 'http://www.google.com',
      avatar: 'http://placehold.it/60x30'
    },
    {
      domain: 'google.com',
      title: 'Title',
      href: 'http://www.google.com',
      avatar: 'http://placehold.it/60x30'
    }
  ],
  headHtml: '<script>//console.log("im in the head");</script>',
  bodyHtml: '<script>//console.log("im in the body");</script>',
  contentsId: '#contents',
  componentHeadHtml: '<script>//console.log("im in the component head");</script>',
  componentBodyHtml: '<script>//console.log("im in the component body");</script>',
  brandColor: 'CRIMSON'
});