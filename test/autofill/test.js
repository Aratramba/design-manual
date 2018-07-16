const test = require("ava");
const rimraf = require("rimraf");
const fs = require("fs");

const DM = require("../../lib/index");

const config = {
  output: __dirname + "/tmp/",
  pages: __dirname + "/",
  components: "./test/components.json",
  renderComponents: true,
  renderCSS: false,
  meta: {
    domain: "website.com",
    title: "Design Manual"
  }
};

test.cb("autofill", t => {
  t.plan(3);
  rimraf.sync(__dirname + "/tmp/");

  DM.build(
    Object.assign({}, config, {
      renderComponents: true,
      onLog: () => {},
      onComplete: () => {
        setTimeout(() => {
          let componentsHtmlTmp = fs.readFileSync(
            config.output + "autofill.html",
            "utf8"
          );
          t.truthy(
            componentsHtmlTmp.indexOf(
              '<div class="component js-section is-loading" id="component1">'
            ) === -1
          );
          t.truthy(
            componentsHtmlTmp.indexOf(
              '<div class="component js-section is-loading" id="component2">'
            ) > -1
          );
          t.truthy(
            componentsHtmlTmp.indexOf(
              '<div class="component js-section is-loading" id="component3">'
            ) > -1
          );
          t.end();
        }, 1000);
      }
    })
  );
});
