'use strict';
/* global require */

var rimraf = require('rimraf');
rimraf.sync('httpdocs/*');

var DesignManual = require('../index');

new DesignManual({
  forceUpdate: true,
  output: 'examples/httpdocs/',
  pages: 'examples/pages/',
  indexPage: 'Index.md',
  componentsPage: 'Components.md',
  components: 'examples/components.json',
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
  headHtml: '',
  bodyHtml: '',
  contentsFlag: 'contents',
  componentHeadHtml: `
    <link rel="stylesheet" href="/assets/style.css">
    <link rel="stylesheet" href="/assets/nav.css">
  `,
  componentBodyHtml: `
  <script>
    var $hamburger = document.querySelector('button.hamburger');
    if ($hamburger) {
      $hamburger.addEventListener('click', function(e) {
        document.body.classList.toggle('nav-is-open');
      });
    }
  </script>
  `,
  brandColor: 'dodgerblue',
  brandColorContrast: 'white',
  prerenderComponents: true,
  prerender: {
    port: 3000,
    path: '',
    serveFolder: 'examples/httpdocs/',
  },
  onComplete: function() {
    console.log('callback');
  }
});