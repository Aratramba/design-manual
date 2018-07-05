// const rimraf = require('rimr̦af');
// const fs = require('fs');
const analyzer = require("../../lib/static-analysis");
// const DM = require('../../lib/index');
const util = require("util");

analyzer.scan(__dirname + "/").then(results => {
  console.log(util.inspect(results, false, null));

  const usedComponents = analyzer.getScanUsedComponents(results);
  console.log("used", usedComponents);

  const unusedComponents = analyzer.getScanUnusedComponents(
    results,
    require("../components.json")
  );
  console.log("unused", unusedComponents);
});
