var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var assign = require('object-assign');

var pages = require('./pages');
var components = require('./components');
var assets = require('./assets');
var validate = require('./validate');


/**
 * Init
 */

var queue;

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

    // generate components and after that pages if render components is set
    if (options.renderComponents) {
      queue.push('components');
      components.start(options, function() {
        queue.splice(queue.indexOf('components'), 1);

        // generate pages
        if (options.renderPages) {
          queue.push('pages');
          pages.start(options, function() {
            queue.splice(queue.indexOf('pages'), 1);
            done(options.onComplete);
          });
        }
      });
    
    // generate pages
    } else {
      if (options.renderPages) {
        queue.push('pages');
        pages.start(options, function() {
          queue.splice(queue.indexOf('pages'), 1);
          done(options.onComplete);
        });
      }
    }

    // generate js
    if (options.renderJS) {
      queue.push('js');
      assets.js(options.output, function() {
        queue.splice(queue.indexOf('js'), 1);
        done(options.onComplete);
      });
    }

    // generate css
    if (options.renderCSS) {
      queue.push('css');
      assets.css(options.output, options.brandColor, options.brandColorContrast, function() {
        queue.splice(queue.indexOf('css'), 1);
        done(options.onComplete);
      });
    }

    done(options.onComplete);
  });
}

module.exports.build = build;


/**
 * Complete
 */

function done(cb) {
  if (queue.length === 0) {
    console.log('Design manual complete');

    if (typeof cb === 'function') {
      cb();
    }
  }
}


/**
 * Interrupt
 */

function interrupt() {
  console.log('Caught interrupt signal');
}

module.exports.interrupt = interrupt;