var cp = require('child_process');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var assign = require('object-assign');

var validate = require('./validate');

var PROCESS_TYPE_JS = 'js';
var PROCESS_TYPE_CSS = 'css';
var PROCESS_TYPE_PAGES = 'pages';
var PROCESS_TYPE_COMPONENTS = 'components';

var jsProcess;
var cssProcess;
var pagesProcess;
var componentsProcess;
var queue;


/**
 * Build
 */

var lastOptions;

function build(options) {

  if (queue && queue.length) {
    lastOptions = options;
    interrupt();
    return;
  }

  if (!options && lastOptions) {
    options = lastOptions;
  }

  console.log('Starting design manual');

  // options
  options = assign({
    force: false,
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

  if (options.force) {
    console.log('- Forcing rebuild');
    fs.writeFileSync(path.resolve(options.output, 'design-manual.json'), '[]');
  }

  queue = [];

  mkdirp(options.output, function(err) {
    if (err) {
      throw err;
    }

    if (options.renderJS) {
      queue.push(PROCESS_TYPE_JS);
    }
    if (options.renderCSS) {
      queue.push(PROCESS_TYPE_CSS);
    }
    if (options.renderComponents) {
      queue.push(PROCESS_TYPE_COMPONENTS);
    }
    if (options.renderPages) {
      queue.push(PROCESS_TYPE_PAGES);
    }

    if (!options.renderJS && !options.renderCSS && !options.renderComponents && !options.renderPages) {
      complete(null, options.onComplete);
    }

    // generate js
    if (options.renderJS) {
      jsProcess = cp.fork(`${__dirname}/js.js`, [JSON.stringify(options)]);
      jsProcess.on('message', function() {
        complete(PROCESS_TYPE_JS, options.onComplete);
      });
    }

    // generate css
    if (options.renderCSS) {
      cssProcess = cp.fork(`${__dirname}/css.js`, [JSON.stringify(options)]);
      cssProcess.on('message', function() {
        complete(PROCESS_TYPE_CSS, options.onComplete);
      });
    }


    // generate components
    if (options.renderComponents) {
      componentsProcess = cp.fork(`${__dirname}/components.js`, [[JSON.stringify(options)]]);
      componentsProcess.on('message', function() {
        complete(PROCESS_TYPE_COMPONENTS, options.onComplete);

        // generate pages
        if (options.renderPages) {
          pagesProcess = cp.fork(`${__dirname}/pages.js`, [[JSON.stringify(options)]]);
          pagesProcess.on('message', function() {
            complete(PROCESS_TYPE_PAGES, options.onComplete);
          });
        }
      });

    } else {
      // generate pages
      if (options.renderPages) {
        pagesProcess = cp.fork(`${__dirname}/pages.js`, [[JSON.stringify(options)]]);
        pagesProcess.on('message', function() {
          complete(PROCESS_TYPE_PAGES, options.onComplete);
        });
      }
    }
  });
}

module.exports.build = build;


/**
 * Complete
 */

function complete(type, cb) {

  if (type !== null) {
    console.log('- Generated ' + type);
    queue.splice(queue.indexOf(type), 1);
  }

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
  console.log('Caught interrupt signal, closing');

  if (queue.indexOf(PROCESS_TYPE_JS) > -1 && jsProcess) {
    jsProcess.kill();
  }
  if (queue.indexOf(PROCESS_TYPE_CSS) > -1 && cssProcess) {
    cssProcess.kill();
  }
  if (queue.indexOf(PROCESS_TYPE_PAGES) > -1 && pagesProcess) {
    pagesProcess.kill();
  }
  if (queue.indexOf(PROCESS_TYPE_COMPONENTS) > -1 && componentsProcess) {
    componentsProcess.kill();
  }

  queue = null;
  build();
}

module.exports.interrupt = interrupt;