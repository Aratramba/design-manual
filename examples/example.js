'use strict';
/* global require */

var rimraf = require('rimraf');
rimraf.sync('httpdocs/*');

var dm = require('../lib/index');

function build() {
  dm.build({
    output: 'examples/httpdocs/',
    pages: 'examples/pages/',
    components: 'examples/components.json',
    meta: {
      domain: 'website.com',
      title: 'Design Manual',
      avatar: 'http://placehold.it/100x50',
      version: 'v' + require('../package.json').version
    },
    nav: [
      { label: 'Home', href: '/index.html' },
      { label: 'Components', href: '/components.html' },
      { label: 'Content Guidelines', href: '/content-guidelines.html' },
      { label: 'Design Principles', href: '/design-principles.html' }
    ],
    headHtml: `
      <style>
        .content h1 {
          color: inherit;
        }
        .header {
          background-color: sienna;
        }
        .component &.is-loading:before {
          border-top-color: red;
          border-left-color: red;
        }
        .component__meta:before {
          background-color: red;
        }
        .sidebar__nav__item__link {
          background-color: red;
        }
      </style>
    `,
    bodyHtml: '',
    contentsFlag: 'contents',
    componentHeadHtml: `
      <link rel="stylesheet" href="/lib.css">
    `,
    componentBodyHtml: `
    <script>
      var $hamburger = document.querySelector('.hamburger');
      if ($hamburger) {
        $hamburger.addEventListener('click', function(e) {
          document.body.classList.toggle('nav-is-open');
        });
      }
    </script>
    `,
    renderPages: true,
    renderComponents: true,
    renderJS: true,
    renderCSS: true,
    prerender: {
      port: 3000,
      path: '',
      serveFolder: 'examples/httpdocs/',
    },
    onComplete: function() {
      console.log('callback');
    }
  });
}

build();

// setTimeout(function() {
//   dm.interrupt(build);
// }, 2500);