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

  
  // options
  let options = Object.assign({
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
    onLog: console.log,
    onComplete: () => {}
  }, config);
  
  validate(options);
  
  log('Starting design manual', options.onLog);

  // check current component configuration against previous config
  // if componentBodyHtml or componentHeadHtml is changed, force component rebuild
  try {
    let prevConfig = fs.readFileSync(path.resolve(options.output, 'design-manual-config.json'), 'utf8');
    if (prevConfig) {
      
      try {
        prevConfig = JSON.parse((prevConfig).toString());
        if (options.componentHeadHtml !== (prevConfig.componentHeadHtml || '') || options.componentBodyHtml !== (prevConfig.componentBodyHtml || '')) {
          log('- Detected changed configuration', options.onLog);
          options.force = true;
        }
      } catch (err) {
        log('- Error parsing previous configuration', options.onLog);
        options.force = true;
      }            
    }
  } catch(err) {
    log('- Could not find previous configuration', options.onLog);
    options.force = true;
  }

  // store current config
  mkdirp.sync(options.output);  
  fs.writeFileSync(path.resolve(options.output, 'design-manual-config.json'), JSON.stringify(config));

  // resolve ouput paths
  options.output = path.resolve(options.output);
  options.pages = path.resolve(options.pages);
  options.components = path.resolve(options.components);

  // force rebuild by writing empty components file
  if (options.force) {
    log('- Forcing rebuild', options.onLog);
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
    renderer[type] = cp.fork(`${__dirname}/${type}.js`, [[JSON.stringify(options)]], { silent: true });
    renderer[type].on('message', (data) => {
      if (cb) cb(data);
      complete(type, options);
    });

    renderer[type].stdout.on('data', (data) => {
      log(data, options.onLog);
    });
 }


/**
 * Complete
 */

function complete(type, options) {

  if (type !== null) {
    log('- Generated ' + type, options.onLog);
    queue.splice(queue.indexOf(type), 1);
  }

  if (queue.length === 0) {
    log('Design manual complete', options.onLog);

    if (typeof options.onComplete === 'function') {
      options.onComplete();
    }
  }
}


/**
 * Interrupt
 */

function interrupt(config) {
  log('Caught interrupt signal, closing', config.onLog);

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


/**
 * Log
 */

 function log(msg, onLog) {
   if (typeof onLog === 'function') onLog(msg.toString().replace(/\n/g, ''));
 }