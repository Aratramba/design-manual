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
 * Test output change, rebuild all
 */

test.cb('config: output change', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp2/');

  const expected = `
    Starting design manual
    Could not find previous configuration
    Forcing components rebuild
    Forcing pages rebuild
    Starting components
    Found 3 changed components
    Rendering component ./lib/component1.html
    Rendering component ./lib/component2.html
    Rendering component ./lib/component3.html
    Generated components
    Starting pages
    Found 2 changed pages
    Generated test/config/tmp2/page.html
    Generated test/config/tmp2/page2.html
    Generated pages
    Design manual complete
  `;

  buildAndMatchLogs(null, config, null, () => {
    buildAndMatchLogs(t, Object.assign(config, { output: __dirname + '/tmp2/' }), expected);
  });
});

test.after.cb(t => {
  rimraf.sync(__dirname + '/tmp2/');
  t.end();
})