const test = require("ava");
const rimraf = require("rimraf");

const isThere = require("is-there");
const DM = require("../../lib/index");

const config = {
  output: __dirname + "/tmp/",
  pages: __dirname + "/",
  components: "./test/components.json",
  renderComponents: false,
  renderCSS: false,
  meta: {
    domain: "website.com",
    title: "Design Manual"
  }
};

test.cb("render css", t => {
  t.plan(1);
  rimraf.sync(__dirname + "/tmp");

  DM.build(
    Object.assign({}, config, {
      renderCSS: true,
      onLog: () => {},
      onComplete: () => {
        t.true(isThere(config.output + "all.min.css"), "css exists");
        t.end();
      }
    })
  );
});

test.cb("don't render css", t => {
  t.plan(1);
  rimraf.sync(__dirname + "/tmp");

  DM.build(
    Object.assign({}, config, {
      renderCSS: false,
      onLog: () => {},
      onComplete: () => {
        t.true(!isThere(config.output + "app.min.js"), "css does not exist");
        t.end();
      }
    })
  );
});
