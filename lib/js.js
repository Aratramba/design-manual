var fs = require('fs');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var ON_DEATH = require('death')({ uncaughtException: true });

var options = JSON.parse(process.argv[2]);

if (!options.renderJS) {
  process.send(1);
  return;
}


/**
 * Generate js
 */

mkdirp.sync(options.output);

var b = browserify();
b.add(__dirname + '/../template/scripts/index.js');
b.transform({
  global: true
}, 'uglifyify');
b.bundle(function (err, buf) {
  if (err) {
    throw err;
  }

  fs.writeFile(options.output + '/app.min.js', buf, function (err) {
    if (err) {
      console.log(err);
      process.exitCode = 1;
      return;
    }
    process.send(1);
  });
});

ON_DEATH((signal, err) => {
  process.exit();
});