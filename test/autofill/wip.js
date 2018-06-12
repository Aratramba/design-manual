
const rimraf = require('rimraf');
const fs = require('fs');
const scan = require('../../lib/static-analysis');
const DM = require('../../lib/index');

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

scan(__dirname + '/../').then(console.log);