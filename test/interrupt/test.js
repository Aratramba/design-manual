const test = require("ava");
const rimraf = require("rimraf");

const DM = require("../../lib/index");

const config = {
  output: __dirname + "/tmp/",
  pages: __dirname + "/",
  components: "./test/components.json",
  meta: {
    domain: "website.com",
    title: "Design Manual"
  }
};

test.cb("interrupt", t => {
  t.plan(1);
  rimraf.sync(__dirname + "/tmp");

  DM.build(
    Object.assign({}, config, {
      onLog: () => {},
      onComplete: () => {
        t.fail();
        t.end();
      }
    })
  );

  setTimeout(() => {
    DM.build(
      Object.assign({}, config, {
        onLog: () => {},
        onComplete: () => {
          t.pass();
          t.end();
        }
      })
    );
  }, 250);

  setTimeout(() => {
    DM.build(
      Object.assign({}, config, {
        onLog: () => {},
        onComplete: () => {
          t.fail();
          t.end();
        }
      })
    );
  }, 200);
});
