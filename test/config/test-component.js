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
 * Test component changes
 */

test.cb("config: component change", t => {
  t.plan(1);

  rimraf.sync(__dirname + "/tmp/");

  const expected = `
    Starting design manual
    Starting components
    Found 1 changed component
    Rendering component ./lib/component1.html
    Generated components
    Starting pages
    Found 1 changed page
    Generated test/config/tmp/page.html
    Generated pages
    Design manual complete
  `;

  buildAndMatchLogs(
    null,
    Object.assign(config, { components: "./test/components.json" }),
    null,
    () => {
      buildAndMatchLogs(
        t,
        Object.assign(config, { components: "./test/components2.json" }),
        expected
      );
    }
  );
});
