
const rimraf = require('rimraf');
const fs = require('fs');
const analyzer = require('../../lib/static-analysis');
const DM = require('../../lib/index');
const util = require('util')

// const config = {
//   output: __dirname + '/tmp/',
//   pages: __dirname + '/',
//   components: './test/components.json',
//   renderComponents: true,
//   renderCSS: false,
//   meta: {
//     domain: 'website.com',
//     title: 'Design Manual'
//   }
// }

// rimraf.sync(__dirname + '/tmp/');
// DM.build(config);

analyzer.scan(__dirname + '/../').then((results) => {
  console.log(util.inspect(results, false, null));

  console.log(analyzer.getUsedComponentIds(results));
});