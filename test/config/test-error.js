const test = require("ava");
const rimraf = require("rimraf");
const fs = require("fs");
const path = require("path");
const utils = require("../utils");
const buildAndMatchLogs = utils.buildAndMatchLogs;

const config = {
  output: __dirname + "/tmp/",
  pages: __dirname + "/",
  components: "./test/components.json",
  meta: {
    domain: "website.com",
    title: "Design Manual"
  },
  renderComponents: true,
  renderCSS: false
};

/**
 * Test error in config file
 */

test.cb("config: error in config", t => {
  t.plan(1);
  rimraf.sync(config.output);

  const expected = `
    Starting design manual
    Error parsing previous configuration
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
    Generated test/config/tmp/page.html
    Generated test/config/tmp/page2.html
    Generated pages
    Design manual complete
  `;

  buildAndMatchLogs(null, config, null, () => {
    fs.writeFileSync(
      path.resolve(config.output, "design-manual-config.json"),
      "foo"
    );
    buildAndMatchLogs(t, config, expected);
  });
});
