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
 * Test mandatory options
 */

test.cb("config: validate output", t => {
  t.plan(1);

  const options = Object.assign({}, config, { output: null });

  const expected = `
    Design Manual error: options.output is required
    Design manual complete
  `;

  buildAndMatchLogs(t, options, expected);
});

test.cb("config: validate pages", t => {
  t.plan(1);

  const options = Object.assign({}, config, { pages: null });

  const expected = `
    Design Manual error: options.pages is required
    Design manual complete
  `;

  buildAndMatchLogs(t, options, expected);
});

test.cb("config: validate components", t => {
  t.plan(1);

  const options = Object.assign({}, config, { components: null });

  const expected = `
    Design Manual error: options.components is required
    Design manual complete
  `;

  buildAndMatchLogs(t, options, expected);
});

test.cb("config: validate meta", t => {
  t.plan(1);

  const options = Object.assign({}, config, { meta: null });

  const expected = `
    Design Manual error: options.meta is required
    Design manual complete
  `;

  buildAndMatchLogs(t, options, expected);
});

test.cb("config: validate meta.title", t => {
  t.plan(1);

  const options = Object.assign({}, config, {
    meta: { title: null, domain: "foo" }
  });

  const expected = `
    Design Manual error: options.meta.title is required
    Design manual complete
  `;

  buildAndMatchLogs(t, options, expected);
});

test.cb("config: validate meta.domain", t => {
  t.plan(1);

  const options = Object.assign({}, config, {
    meta: { title: "foo", domain: null }
  });

  const expected = `
    Design Manual error: options.meta.domain is required
    Design manual complete
  `;

  buildAndMatchLogs(t, options, expected);
});
