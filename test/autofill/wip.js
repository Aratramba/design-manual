// const rimraf = require('rimr̦af');
// const fs = require('fs');
const analyzer = require("../../lib/static-analysis");
// const DM = require('../../lib/index');
// const util = require("util");

analyzer.report(__dirname + "/", require("../components.json"));
