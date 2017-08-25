var fs = require('fs');
var mkdirp = require('mkdirp');
var sass = require('node-sass');
var postcss = require('postcss');
var CleanCSS = require('clean-css');
var autoprefixer = require('autoprefixer');

var options = JSON.parse(process.argv[2]);


/**
 * Generate css
 */

mkdirp.sync(options.output);

sass.render({
  file: __dirname + '/../template/styles/all.scss',
  outFile: options.output +'/all.min.css',
}, function(err, result) { 
  if(err) { 
    console.log(err);
    process.exitCode = 1;
    return;
  }

  postcss([ autoprefixer ]).process(result.css).then(function (result) {

    if (options.brandColor) {
      result.css = result.css.replace(/STEELBLUE/g, options.brandColor);
    }
    
    if (options.brandColorContrast) {
      result.css = result.css.replace(/WHITESMOKE/g, options.brandColorContrast);
    }

    var cleaned = new CleanCSS().minify(result.css);
    fs.writeFile(options.output +'/all.min.css', cleaned.styles, function(err) {
      if(err) { 
        throw err;
      }

      process.send(1);
    });
  });
});

process.on('SIGTERM', quit);

function quit() {
  console.log('Cancelling css');
  process.exit();
}