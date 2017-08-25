var cp = require('child_process');
var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var assign = require('object-assign');

var validate = require('./validate');

var PROCESS_TYPE_JS = 'js';
var PROCESS_TYPE_CSS = 'css';
var PROCESS_TYPE_PAGES = 'pages';
var PROCESS_TYPE_COMPONENTS = 'components';



/**
 * Complete
 */

var queue;

function complete(type, cb) {
  console.log('- Generated ' + type);
  queue.splice(queue.indexOf('css'), 1);
  if (queue.length === 0) {
    console.log('Design manual complete');

    if (typeof cb === 'function') {
      cb();
    }
  }
}


function build(options) {

  console.log('Starting design manual');

  // options
  options = assign({
    output: null,
    pages: null,
    components: null,
    meta: {
      domain: '',
      title: '',
      avatar: '',
      version: ''
    },
    nav: [],
    headHtml: '',
    bodyHtml: '',
    componentHeadHtml: '',
    componentBodyHtml: '',
    contentsFlag: 'contents',
    brandColor: null,
    brandColorContrast: null,
    renderPages: true,
    renderComponents: true,
    renderJS: true,
    renderCSS: true,
    prerender: null,
    onComplete: function() {}
  }, options);

  validate(options);

  options.output = path.resolve(options.output);
  options.pages = path.resolve(options.pages);
  options.components = path.resolve(options.components);

  queue = [];

  // remove all old files
  rimraf.sync(options.output + '/**/*.html');
  rimraf.sync(path.resolve(options.output, 'design-manual.json'));
  rimraf.sync(path.resolve(options.output, 'lib'));
  rimraf.sync(path.resolve(options.output, 'app.min.js'));
  rimraf.sync(path.resolve(options.output, 'all.min.css'));

  mkdirp(options.output, function(err) {
    if (err) {
      throw err;
      }

    // generate js
    if (options.renderJS) {
      queue.push(PROCESS_TYPE_JS);
      var js = cp.fork(`${__dirname}/js.js`, [JSON.stringify(options)]);
      js.on('message', function() {
        complete(PROCESS_TYPE_JS, options.onComplete);
      });
    }

    // generate css
    if (options.renderCSS) {
      queue.push(PROCESS_TYPE_CSS);
      var css = cp.fork(`${__dirname}/css.js`, [JSON.stringify(options)]);
      css.on('message', function() {
        complete(PROCESS_TYPE_CSS, options.onComplete);
      });
    }


    // generate components
    if (options.renderComponents) {
      queue.push(PROCESS_TYPE_COMPONENTS);
      var components = cp.fork(`${__dirname}/components.js`, [[JSON.stringify(options)]]);
      components.on('message', function() {
        complete(PROCESS_TYPE_COMPONENTS, options.onComplete);

        // generate pages
        if (options.renderPages) {
          queue.push(PROCESS_TYPE_PAGES);
          var pages = cp.fork(`${__dirname}/pages.js`, [[JSON.stringify(options)]]);
          pages.on('message', function() {
            complete(PROCESS_TYPE_PAGES, options.onComplete);
          });
        }
      });

    } else {
      // generate pages
      if (options.renderPages) {
        queue.push(PROCESS_TYPE_PAGES);
        var pages = cp.fork(`${__dirname}/pages.js`, [[JSON.stringify(options)]]);
        pages.on('message', function() {
          complete(PROCESS_TYPE_PAGES, options.onComplete);
        });
      }
    }
  });
}

module.exports.build = build;