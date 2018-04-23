const fs = require('fs');
const mkdirp = require('mkdirp');
const sass = require('node-sass');
const postcss = require('postcss');
const CleanCSS = require('clean-css');
const autoprefixer = require('autoprefixer');
const ON_DEATH = require('death')({ uncaughtException: true });

const options = JSON.parse(process.argv[2]);

if (!options.renderCSS) {
  process.send(1);
  return;
}


/**
 * Generate css
 */

mkdirp.sync(options.output);

sass.render({
  file: __dirname + '/../template/styles/all.scss',
  outFile: options.output + '/all.min.css',
}, (err, result) => {
  if (err) {
    console.log(err);
    process.exitCode = 1;
    return;
  }

  postcss([autoprefixer]).process(result.css).then((result) => {
    const cleaned = new CleanCSS().minify(result.css);
    fs.writeFile(options.output + '/all.min.css', cleaned.styles, (err) => {
      if (err) {
        throw err;
      }

      process.send(1);
    });
  });
});

ON_DEATH((signal, err) => {
  process.exit();
});