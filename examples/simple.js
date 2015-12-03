'use strict';
/* global require */

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