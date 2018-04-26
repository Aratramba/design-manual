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
 * Test component body html change
 */

test.cb('config: component body html change', t => {
  t.plan(1);
  rimraf.sync(config.output);

  const expected = `
    Starting design manual
    Detected changed configuration (components body html)
    Forcing components rebuild
    Starting components
    Found 3 changed components
    Rendering component ./lib/component1.html
    Rendering component ./lib/component2.html
    Rendering component ./lib/component3.html
    Generated components
    Starting pages
    Found 1 changed page
    Generated test/config/tmp/page.html
    Generated pages
    Design manual complete
  `;
  buildAndMatchLogs(null, config, null, () => {
    buildAndMatchLogs(t, Object.assign(config, { componentBodyHtml: '<script></script>' }), expected);
  });
});