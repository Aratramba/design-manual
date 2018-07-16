const test = require("ava");
const fs = require("fs");
const rimraf = require("rimraf");

const DM = require("../../lib/index");

const config = {
  output: __dirname + "/tmp/",
  pages: __dirname + "/",
  components: "./test/components.json",
  meta: {
    domain: "website.com",
    title: "Design Manual"
  },
  renderComponents: false,
  renderCSS: false
};

test.cb("add head html", t => {
  t.plan(1);
  rimraf.sync(__dirname + "/tmp/head/");

  DM.build(
    Object.assign({}, config, {
      output: config.output + "head/",
      headHtml: "<style>foo{}</style>",
      onLog: () => {},
      onComplete: () => {
        setTimeout(() => {
          let componentsHtmlTmp = fs.readFileSync(
            config.output + "head/page.html",
            "utf8"
          );
          t.truthy(componentsHtmlTmp.indexOf("<style>foo{}</style>") > -1);

          t.end();
        }, 1000);
      }
    })
  );
});

test.cb("add body html", t => {
  t.plan(1);
  rimraf.sync(__dirname + "/tmp/body/");

  DM.build(
    Object.assign({}, config, {
      output: config.output + "body/",
      bodyHtml: '<script>alert("foo");</script>',
      onLog: () => {},
      onComplete: () => {
        setTimeout(() => {
          let componentsHtmlTmp = fs.readFileSync(
            config.output + "body/page.html",
            "utf8"
          );
          t.truthy(
            componentsHtmlTmp.indexOf('<script>alert("foo");</script>') > -1
          );
          t.end();
        }, 1000);
      }
    })
  );
});
