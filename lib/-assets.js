var fs = require('fs');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var autoprefixer = require('autoprefixer');
var CleanCSS = require('clean-css');
var postcss = require('postcss');
var sass = require('node-sass');


/**
 * Generate js
 */

function js(output, cb) {
  mkdirp.sync(output);

  var b = browserify();
  b.add(__dirname + '/../template/scripts/index.js');
  b.transform({
    global: true
  }, 'uglifyify');
  b.bundle(function(err, buf) {
    if(err) {
      throw err;
    }

    fs.writeFile(output +'/app.min.js', buf, function(err) {
      if(err) { 
        console.log(err);
        process.exitCode = 1;
        return;
      }

      console.log('- Generated template js');
      cb();
    });
  });
}


module.exports.js = js;


/**
 * Generate css
 */

function css(output, brandColor, brandColorContrast, cb) {
  mkdirp.sync(output);

  sass.render({
    file: __dirname + '/../template/styles/all.scss',
    outFile: output +'/all.min.css',
  }, function(err, result) { 
    if(err) { 
      console.log(err);
      process.exitCode = 1;
      return;
    }

    postcss([ autoprefixer ]).process(result.css).then(function (result) {

      if (brandColor) {
        result.css = result.css.replace(/STEELBLUE/g, brandColor);
      }
      
      if (brandColorContrast) {
        result.css = result.css.replace(/WHITESMOKE/g, brandColorContrast);
      }

      var cleaned = new CleanCSS().minify(result.css);
      fs.writeFile(output +'/all.min.css', cleaned.styles, function(err) {
        if(err) { 
          throw err;
        }

        console.log('- Generated template css');
        cb();
      });
    });
  });
}

module.exports.css = css;