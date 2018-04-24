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
 * Test meta change
 */

const expectedMetaChange = `
  Starting design manual
  - Detected changed configuration (meta)
  - Forcing pages rebuild
  - Starting components
  - Found 0 changed components
  - Generated components
  - Starting pages
  - Found 2 changed pages
  -- Generated test/config/tmp/page.html
  -- Generated test/config/tmp/page2.html
  - Generated pages
  Design manual complete
`;

test.cb('config: meta change', t => {
  t.plan(1);
  buildAndMatchLogs(null, config, null, () => {
    buildAndMatchLogs(t, Object.assign(config, { meta: { domain: '0', title: '0', avatar: '0', version: '0' } }), expectedMetaChange);
  });
});

test.cb('config: meta change (domain)', t => {
  t.plan(1);
  buildAndMatchLogs(t, Object.assign(config, { meta: { domain: '1', title: '0', avatar: '0', version: '0' } }), expectedMetaChange);
});

test.cb('config: meta change (title)', t => {
  t.plan(1);
  buildAndMatchLogs(t, Object.assign(config, { meta: { domain: '1', title: '1', avatar: '0', version: '0' } }), expectedMetaChange);
});

test.cb('config: meta change (avatar)', t => {
  t.plan(1);
  buildAndMatchLogs(t, Object.assign(config, { meta: { domain: '1', title: '1', avatar: '1', version: '0' } }), expectedMetaChange);
});

test.cb('config: meta change (version)', t => {
  t.plan(1);
  buildAndMatchLogs(t, Object.assign(config, { meta: { domain: '1', title: '1', avatar: '1', version: '1' } }), expectedMetaChange);
});
