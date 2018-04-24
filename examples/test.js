const rimraf = require('rimraf');
const fs = require('fs');

const DM = require('../lib/index');

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
 * test for no changes
 */

// rimraf.sync(config.output);

DM.build(Object.assign({}, config, {
  nav: [2],
  onComplete: () => {
    
  }
}));