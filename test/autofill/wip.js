// const rimraf = require('rimr̦af');
// const fs = require('fs');
// const analyzer = require("../../lib/static-analysis");
// const DM = require('../../lib/index');
// const util = require("util");

// analyzer.report(__dirname + "/", require("../components.json"));

const rimraf = require('rimraf');
const fs = require('fs');
const analyzer = require('../../lib/static-analysis');
const DM = require('../../lib/index');
const util = require('util')

const config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  renderComponents: true,
  renderCSS: false,
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

rimraf.sync(__dirname + '/tmp/');
DM.build(config);
