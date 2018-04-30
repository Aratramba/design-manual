const test = require('ava');
const rimraf = require('rimraf');
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
 * test if no configuration was found
 */

test.cb('config: new config', t => {
  t.plan(1);
  rimraf.sync(config.output);

  const expected = `
    Starting design manual
    Starting components
    Found 0 changed components
    Generated components
    Starting pages
    Found 0 changed pages
    Generated pages
    Design manual complete
  `;

  buildAndMatchLogs(null, config, null, () => {
    buildAndMatchLogs(t, config, expected);
  });
});