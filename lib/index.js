const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const assign = require('object-assign');

const validate = require('./validate');


let renderer = {
  css: null,
  components: null,
  pages: null
};

let queue;


/**
 * Build
 */

function build(config) {

  if (queue && queue.length) {
    interrupt(config);
    return;
  }

  console.log('Starting design manual');

  // options
  let options = assign({
    force: false,
    output: null,
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
    renderComponents: true,
    renderCSS: true,
    prerender: null,
    onComplete: function() {}
  }, config);

  validate(options);


  // check current configuration against previous config
  try {
    const prevConfig = fs.readFileSync(path.resolve(options.output, 'design-manual-config.json'), 'utf8');
    if (prevConfig) {
      if (prevConfig !== JSON.stringify(config)) {
        console.log('- Detected changed configuration');
        options.force = true;
      }
    }
  } catch(err) {
    options.force = true;
  }

  options.output = path.resolve(options.output);
  options.pages = path.resolve(options.pages);
  options.components = path.resolve(options.components);

  mkdirp.sync(options.output);
  fs.writeFileSync(path.resolve(options.output, 'design-manual-config.json'), JSON.stringify(config));

  if (options.force) {
    console.log('- Forcing rebuild');
    fs.writeFileSync(path.resolve(options.output, 'design-manual-components.json'), '[]');
  }
  
  // create queue
  queue = ['components'];
  if (options.renderCSS) queue.push('css');
  if (options.renderComponents) queue.push('components');

  // render
  if (options.renderCSS) render('css', options);

  // generate components
  if (options.renderComponents) {
    render('components', options, (updatedComponents) => {
      options.updatedComponents = updatedComponents;
      render('pages', options);
    });
  } else {
    render('pages', options);
  }
}

module.exports.build = build;


/**
 * Render
 */

 function render(type, options, cb) {
   renderer[type] = cp.fork(`${__dirname}/${type}.js`, [[JSON.stringify(options)]]);
   renderer[type].on('message', function () {
     if (cb) cb();
     complete(type, options.onComplete);
   });
 }


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

function interrupt(config) {
  console.log('Caught interrupt signal, closing');

  if (queue.indexOf('css') > -1 && renderer['css']) {
    renderer['css'].kill();
  }
  if (queue.indexOf('components') > -1 && renderer['components']) {
    renderer['components'].kill();
  }
  if (queue.indexOf('pages') > -1 && renderer['pages']) {
    renderer['pages'].kill();
  }

  queue = null;
  build(config);
}

module.exports.interrupt = interrupt;