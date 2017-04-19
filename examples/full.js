'use strict';
/* global require */

var rimraf = require('rimraf');
rimraf.sync('httpdocs/*');

var DesignManual = require('../index');

new DesignManual({
  forceUpdate: true,
  output: 'examples/full/',
  pages: 'test/fixtures/pages/',
  indexPage: 'Index.md',
  componentsPage: 'Components.md',
  components: 'test/fixtures/data/components.json',
  websiteCss: ['test/fixtures/assets/style.css', 'test/fixtures/assets/nav.css'],
  meta: {
    domain: 'website.com',
    title: 'Style Guide',
    avatar: 'http://placehold.it/100x50',
    version: 'v' + require('../package.json').version
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
  bodyHtml: `<script>
    var $hamburger = document.querySelector('button.hamburger');
    if ($hamburger) {
      $hamburger.addEventListener('click', function(e) {
        console.log(e);
      });
    }
  </script>`,
  contentsFlag: 'contents',
  componentHeadHtml: '<script>//console.log("im in the component head");</script>',
  componentBodyHtml: '<script>//console.log("im in the component body");</script>',
  brandColor: 'red',
  brandColorContrast: 'white',
  onComplete: function() {
    console.log('callback');
  }
});