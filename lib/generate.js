'use strict';
/* global require, module, console, __dirname */

var autoprefixer = require('autoprefixer');
var browserify = require('browserify');
var assign = require('object-assign');
var CleanCSS = require('clean-css');
var postcss = require('postcss');
var sass = require('node-sass');
var mkdirp = require('mkdirp');
var marked = require('marked');
var async = require('async');
var path = require('path');
var jade = require('jade');
var slug = require('slug');
var fs = require('fs');


// special pages
var PAGE_COMPONENTS = 'Components.md';
var PAGE_INDEX = 'Index.md';
var FORCE_UPDATE = FORCE_UPDATE;


/**
 * Init
 */

function init(options) {
  mkdirp(options.output, function(err) {
    if (err) {
      throw err;
    }

    readFiles(options);
  });
}

module.exports.init = init;


/**
 * Read files
 */

function readFiles(options) {
  fs.readdir(options.pages, function(err, files) {
    var navItems = getNavigation(files);
    
    async.map(files, function(file, cb) {
      filterFile(file, options, cb);
    }, function(err, results) {
      finish(results, options, navItems);
    });
  });
}


/**
 * Filter with modified date
 */

function filterFile(file, options, cb) {
  var mdFile = path.resolve(options.pages, file);
  var htmlFile = path.join(options.output, getOutputFile(file));

  // compare dates of markdown and html file
  isNewer(mdFile, htmlFile, function(hasChanged) {

    // file doesn't exist, use the force
    if (hasChanged === null) {
      return cb(null, {
        file: file,
        update: FORCE_UPDATE
      });
    }

    // if it has been changed, do update
    if (hasChanged) {
      return cb(null, {
        file: file,
        update: true
      });
    }

    // if it hasn't been changed and it's the components page
    if (file === PAGE_COMPONENTS) {

      // also check modified date of components.json
      isNewer(path.resolve(options.components), htmlFile, function(hasChanged) {
        return cb(null, {
          file: file,
          update: hasChanged
        });
      });
    } else {

      // file hasn't been changed
      return cb(null, {
        file: file,
        update: false
      });
    }
  });
}


/**
 * Finish
 */

function finish(results, options, navItems) {
  var forceUpdateAll = results.some(function(item) {
    return (item.update === FORCE_UPDATE);
  });

  if (!forceUpdateAll) {
    results = results.filter(function(item) {
      return (item.update === FORCE_UPDATE || item.update);
    });
  }

  if (!results.length) {
    console.log('Nothing to update');
    return;
  }

  async.series([
    function(cb) {
      processFiles(results, options, navItems, cb);
    },
    function(cb) {
      css(options, cb);
    },
    function(cb) {
      js(options, cb);
    }
  ], function(err, results) {
    console.log('Design manual complete');
  });
}



/**
 * Process files
 */

function processFiles(results, options, navItems, cb) {
  async.each(results, function(result, next) {
    if (result.file !== PAGE_COMPONENTS) {
      createPage(result.file, navItems, options, {}, next);
    } else {
      createComponents(result.file, navItems, options, next);
    }
  }, function(err) {
    cb();
  });
}


/**
 * Compare modified dates of two files
 */

function isNewer(a, b, cb) {
  fs.stat(a, function(err, aStats) {
    fs.stat(b, function(err, bStats) {
      var aDate = aStats.mtime.getTime();
      var bDate;
      if (typeof bStats === 'undefined') {
        return cb(null);
      } else {
        bDate = bStats.mtime.getTime();
      }
      cb(aDate > bDate);
    });
  });
}


/**
 * Generate page from markdown file
 * pass this markdown to the jade template file
 * compile jade file and save to disc
 */

function createPage(file, navItems, options, jadeOptions, cb) {

  var mdFile = path.resolve(options.pages, file);
  var htmlFile = path.join(options.output, getOutputFile(file));
  var fileStream = fs.createReadStream(mdFile);

  fileStream.on('data', function(data) {

    // pass locals to jade template
    var locals = assign({
      content: marked(data.toString()),
      navItems: navItems,
      pageTitle: getPageTitle(htmlFile, options.meta),
      currentPage: getPageName(htmlFile), 
      meta: options.meta,
      subnav: options.subnav,
      headHtml: options.headHtml,
      bodyHtml: options.bodyHtml,
      contentsId: options.contentsId
    }, jadeOptions.locals || {});

    var template = jadeOptions.template || __dirname +'/../template/templates/base.jade';

    // render jade file
    var html = jade.renderFile(template, locals);

    var outputStream = fs.createWriteStream(htmlFile);
    outputStream.write(html);
    outputStream.end();

    console.log('Generated '+ path.relative(process.cwd(), htmlFile));
    cb();
  });
}


/**
 * Generate components page
 */

function createComponents(file, navItems, options, cb) {
  async.series([
    function(cb) {
      getWebsiteCSS(options, cb);
    },
    function(cb) {
      getComponentsJSON(options, cb);
    }
  ], function(err, results) {
    var jadeOptions = {
      template: __dirname +'/../template/templates/components.jade',
      locals: {
        componentsJSON: results[1],
        websiteCss: results[0].join(''),
        componentHeadHtml: options.componentHeadHtml,
        componentBodyHtml: options.componentBodyHtml
      }
    };
    createPage(file, navItems, options, jadeOptions, cb);
  });
}


/**
 * Get all css needed for each component
 */

function getWebsiteCSS(options, cb) {
  async.map(options.websiteCss, function(file, next) {
    fs.readFile(path.resolve(file), 'utf8', function(err, data) {
      if(err) { 
        throw err;
      }

      next(null, data);
    });
  }, function(err, results) {
    cb(null, results);
  });
}


/**
 * Get the components JSON
 */

function getComponentsJSON(options, cb) {
  fs.readFile(path.resolve(options.components), function(err, data) {
    if(err) { 
      throw err;
    }

    var componentsJSON = data.toString();
    componentsJSON = componentsJSON.replace(/<\/script>/gi, '<\\/script>');
    cb(null, componentsJSON);
  });
}


/**
 * Setup navigation
 */

function getNavigation(files) {

  // push label/link to navItems
  return files.map(function(file) {
    return {
      label: file.split('.md')[0],
      link: getOutputFile(file)
    };

  // move home to first page in navigation
  }).sort(function(a,b) {
    if(b.label === PAGE_INDEX.split('.')[0]) {
      return 1;
    }
  }).map(function(item) {
    if (item.label === PAGE_INDEX.split('.')[0]) {
      item.label = 'Home';
    }
    return item;
  });
}


/**
 * Get Page title / path
 */

function getPageName(filename) {
  return filename.split('.md')[0];
}

function getPageTitle(filename, meta) {
  return [path.basename(filename).split('.html')[0], meta.title, meta.domain].join(' - ');
}

function getOutputFile(filename) {
  return slug(getPageName(filename), { lower: true }) +'.html';
}


/**
 * Generate js
 */

function js(options, cb) {
  mkdirp.sync(options.output);

  var b = browserify();
  b.add(__dirname + '/../template/scripts/index.js');
  b.transform({
    global: true
  }, 'uglifyify');
  b.bundle(function(err, buf) {
    if(err) { 
      throw err;
    }

    fs.writeFile(options.output +'/app.min.js', buf, function(err) {
      if(err) { 
        throw err;
      }

      console.log('Generated template js');
      cb();
    });
  });
}


/**
 * Generate css
 */

function css(options, cb) {
  mkdirp.sync(options.output);

  sass.render({
    file: __dirname + '/../template/styles/all.scss',
    outFile: options.output +'/all.min.css',
  }, function(err, result) { 
    if(err) { 
      throw err;
    }

    postcss([ autoprefixer ]).process(result.css).then(function (result) {

      if (options.brandColor) {
        result.css = result.css.replace(/STEELBLUE/g, options.brandColor);
      }

      var cleaned = new CleanCSS().minify(result.css);
      fs.writeFile(options.output +'/all.min.css', cleaned.styles, function(err) {
        if(err) { 
          throw err;
        }

        console.log('Generated template css');
        cb();
      });
    });
  });
}