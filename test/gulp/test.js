const test = require("ava");
const rimraf = require("rimraf");
const gulp = require("gulp");

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

test.cb("gulp", t => {
  t.plan(1);
  rimraf.sync(__dirname + "/tmp");

  setTimeout(() => {
    gulp.task("design-manual")(() => {
      console.log("first: should never finish");
      t.fail();
      t.end();
    });
  }, 0);

  setTimeout(() => {
    gulp.task("design-manual")(() => {
      console.log("third: should finish");
      t.pass();
      t.end();
    });
  }, 400);

  setTimeout(() => {
    gulp.task("design-manual")(() => {
      console.log("second: should never finish");
      t.fail();
      t.end();
    });
  }, 200);
});

gulp.task("design-manual", done => {
  DM.build(
    Object.assign({}, config, {
      onLog: () => {},
      onComplete: function() {
        done();
      }
    })
  );
});
