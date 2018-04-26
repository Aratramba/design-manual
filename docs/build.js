'use strict';
/* global require */

var rimraf = require('rimraf');
rimraf.sync('./*.html');

var DesignManual = require('../lib/index');

DesignManual.build({
  output: 'docs/',
  pages: 'docs/pages/',
  components: 'examples/components.json',
  meta: {
    domain: 'github.com/eightmedia/design-manual',
    title: 'Design Manual',
    avatar: './assets/avatar.png',
    version: 'v' + require('../package.json').version
  },
  headHtml: `
  <link rel="stylesheet" href="./assets/style.css" />
  `,
  bodyHtml: '',
});