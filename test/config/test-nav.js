const test = require('ava');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const buildAndMatchLogs = utils.buildAndMatchLogs;

const config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  },
  renderComponents: true,
  renderCSS: false
}


/**
 * Test nav change
 */

test.cb('config: nav change', t => {
  t.plan(1);
  rimraf.sync(config.output);

  const expected = `
    Starting design manual
    Detected changed configuration (nav)
    Forcing pages rebuild
    Starting components
    Found 0 changed components
    Generated components
    Starting pages
    Found 2 changed pages
    Generated test/config/tmp/page.html
    Generated test/config/tmp/page2.html
    Generated pages
    Design manual complete
  `;

  buildAndMatchLogs(null, config, null, () => {
    buildAndMatchLogs(t, Object.assign(config, { nav: '[1]' }), expected);
  });
});