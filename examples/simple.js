'use strict';
/* global require */

var rimraf = require('rimraf');
rimraf.sync('httpdocs/*');

var DesignManual = require('../index');

new DesignManual({
  output: 'httpdocs/',
  pages: 'test/fixtures/pages/',
  components: 'test/fixtures/data/components.json',
  meta: {
    domain: 'my-domain.com',
    title: 'my Design Manual'
  }
});