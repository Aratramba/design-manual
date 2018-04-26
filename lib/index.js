const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const deepEqual = require('deep-equal');

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

  queue = [];

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
    onComplete: () => { }
  }, config);


  if (!options.components) {
    log('Design Manual error: options.components is required', options.onLog);
    return complete(null, options);
  }

  if (!options.pages) {
    log('Design Manual error: options.pages is required', options.onLog);
    return complete(null, options);
  }

  if (!options.output) {
    log('Design Manual error: options.output is required', options.onLog);
    return complete(null, options);
  }

  if (!options.meta) {
    log('Design Manual error: options.meta is required', options.onLog);
    return complete(null, options);
  }

  if (!options.meta.title) {
    log('Design Manual error: options.meta.title is required', options.onLog);
    return complete(null, options);
  }

  if (!options.meta.domain) {
    log('Design Manual error: options.meta.domain is required', options.onLog);
    return complete(null, options);
  }

  log('Starting design manual', options.onLog);

  // force page/components rebuild
  if (options.force) {
    options.forceComponents = true;
    options.forcePages = true;

    // check current component configuration against previous config
    // if componentBodyHtml or componentHeadHtml is changed, force component rebuild
  } else {

    try {
      let prevConfig = fs.readFileSync(path.resolve(options.output, 'design-manual-config.json'), 'utf8');
      if (prevConfig) {
        try {
          prevConfig = JSON.parse((prevConfig).toString());

          const changedConfigMessage = 'Detected changed configuration';

          // force components when component html changed
          if (options.componentHeadHtml !== (prevConfig.componentHeadHtml || '')) {
            log(`${changedConfigMessage} (components head html)`, options.onLog);
            options.forceComponents = true;
          }

          // force components when component html changed
          if (options.componentBodyHtml !== (prevConfig.componentBodyHtml || '')) {
            log(`${changedConfigMessage} (components body html)`, options.onLog);
            options.forceComponents = true;
          }

          // force pages when meta changed
          if (!deepEqual(options.meta, (prevConfig.meta || { domain: '', title: '', avatar: '', version: '' }))) {
            log(`${changedConfigMessage} (meta)`, options.onLog);
            options.forcePages = true;
          }

          // force pages when nav changed
          if (!deepEqual(options.nav, (prevConfig.nav || []))) {
            log(`${changedConfigMessage} (nav)`, options.onLog);
            options.forcePages = true;
          }

          // force pages when page head html changed
          if (options.headHtml !== (prevConfig.headHtml || '')) {
            log(`${changedConfigMessage} (head html)`, options.onLog);
            options.forcePages = true;
          }

          // force pages when page body html changed
          if (options.bodyHtml !== (prevConfig.bodyHtml || '')) {
            log(`${changedConfigMessage} (body html)`, options.onLog);
            options.forcePages = true;
          }

          // force pages when contentsflag changed
          if (options.contentsFlag !== (prevConfig.contentsFlag || 'contents')) {
            log(`${changedConfigMessage} (contents flag)`, options.onLog);
            options.forcePages = true;
          }

          // force pages when prerender changed
          if (!deepEqual(options.prerender, prevConfig.prerender)) {
            log(`${changedConfigMessage} (prerender)`, options.onLog);
            options.forcePages = true;
          }

          // force both when output has been changed
          if (options.output !== (prevConfig.output || null)) {
            // unreachable: when output changes, there will be no previous
            // configuration, so it will never come here
          }
        } catch (err) {
          log('Error parsing previous configuration', options.onLog);
          options.forceComponents = true;
          options.forcePages = true;
        }
      }
    } catch (err) {
      log('Could not find previous configuration', options.onLog);
      options.forceComponents = true;
      options.forcePages = true;
    }
  }

  // store current config
  mkdirp.sync(options.output);
  fs.writeFileSync(path.resolve(options.output, 'design-manual-config.json'), JSON.stringify(config));

  // resolve ouput paths
  options.output = path.resolve(options.output);
  options.pages = path.resolve(options.pages);
  options.components = path.resolve(options.components);

  // force rebuild by writing empty components file
  if (options.forceComponents) {
    log('Forcing components rebuild', options.onLog);
    fs.writeFileSync(path.resolve(options.output, 'design-manual-components.json'), '[]');
  }

  if (options.forcePages) {
    log('Forcing pages rebuild', options.onLog);
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
    log('Generated ' + type, options.onLog);
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