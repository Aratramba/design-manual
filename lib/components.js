const fs = require('fs');
const path = require('path');
const slug = require('slug');
const mkdirp = require('mkdirp');
const marked = require('marked');
const rimraf = require('rimraf');
const cp = require('child_process');
const killable = require('killable');
const deepEqual = require('deep-equal');
const ON_DEATH = require('death')({ uncaughtException: true });

let http;
let puppet;
let finalhandler;
let serveStatic;
let server;
let updatedComponents = [];

const options = JSON.parse(process.argv[2]);
if (!options.renderComponents) {
  process.send(1);
  return;
}


const LIB_TEMPLATE = `
<!DOCTYPE html>
  <html style="margin: 0; padding: 0px;">
  <head>
    <base target="_blank">
    <title>{{title}}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.0/iframeResizer.contentWindow.min.js"></script>

    <script>
      (function templatePolyfill() {
        if ('content' in document.createElement('template')) {
          return false;
        }

        var templates = document.getElementsByTagName('template');
        var plateLen = templates.length;

        for (var x = 0; x < plateLen; ++x) {
          var template = templates[x];
          var content = template.childNodes;
          var fragment = document.createDocumentFragment();

          while (content[0]) {
            fragment.appendChild(content[0]);
          }

          template.content = fragment;
        }
      })();
    </script>
    <style>
      template {
        display: none !important;
      }
    </style>
    {{componentHeadHtml}}
  </head>
  <body style="margin: 0px; padding: 0px;">
    <div style="padding: 10px;">
      {{output}}
    </div>
    {{componentBodyHtml}}
<template class="dm-raw-source" type="design-manual/template">
{{raw_output}}
</template>
  </body>
</html>
`;


/**
 * Start
 */

function start(options) {
  console.log('Starting components');
  checkJSON(options);  
}

start(options);

module.exports.start = start;


/**
 * Check existence of json file
 */

function checkJSON(options) {
  fs.stat(options.components, (err, stats) => {
    if (err) {
      console.log('Components json not found at' + options.components);
      process.send(1);
    }

    fs.readFile(path.resolve(options.components), (err, componentsJSON) => {
      if (err) {
        console.log('Components json not found at' + options.components);
        process.send(1);
      }
      
      // shortcut: check if components.json actually
      // contains new component information
      // compared to design-manual-components.json.
      fs.readFile(path.resolve(options.output, 'design-manual-components.json'), (err, designManualJSON) => {

        if (err) {
          // no previous components found
        }

        try {
          designManualJSON = JSON.parse((designManualJSON || '[]').toString());
        } catch (err) {
          designManualJSON = [];
        }

        try {
          componentsJSON = JSON.parse(componentsJSON.toString());
        } catch (err) {
          componentsJSON = [];
        }

        let queue = [];

        // loop over components to detect changes
        for (let i = 0, l = componentsJSON.length; i < l; ++i) {

          // first parse description using markdown so it equals the final output
          if (componentsJSON[i].meta && componentsJSON[i].meta.description) {
            componentsJSON[i].meta.description = marked(componentsJSON[i].meta.description);
          }

          // find its match
          let matches = designManualJSON.filter((item) => {
            return (item.meta.name === componentsJSON[i].meta.name);
          });

          // no match: new component
          if (!matches.length) {
            queue.push(componentsJSON[i].meta.name);

            // matches found
          } else {

            // create a clone without the design manual data
            let clone = Object.assign({}, matches[0]);
            delete clone.dm;

            // match that object with component
            if (!deepEqual(componentsJSON[i], clone)) {
              queue.push(componentsJSON[i].meta.name);
            }
          }
        }

        if (queue.length === 1) {
          console.log('Found 1 changed component');
        } else {
          console.log(`Found ${queue.length} changed components`);
        }

        if (!queue.length) {
          return done(options);
        }

        startServer(options, componentsJSON, designManualJSON, queue);
      });
    });
  });
}


/**
 * Start server
 */

function startServer(options, componentsJSON, designManualJSON, queue) {
  if (typeof options.prerender === 'object' && options.prerender !== null) {
    puppet = cp.fork(`${__dirname}/puppeteer.js`);
    http = require('http');
    finalhandler = require('finalhandler');
    serveStatic = require('serve-static');

    puppet.once('message', (data) => {
      if (data === 'puppeteer-ready') {
        createOutput(options, componentsJSON, designManualJSON, queue);
      }
    });

    process.on('exit', quit);
    process.on('SIGINT', quit);

    return;
  }

  createOutput(options, componentsJSON, designManualJSON, queue);
}


/**
 * Create output dir
 */

function createOutput(options, componentsJSON, designManualJSON, queue) {
  const libPath = path.resolve(options.output, 'lib');

  mkdirp(libPath, (err) => {
    if (err) {
      throw err;
    }

    render(options, componentsJSON, designManualJSON, queue);
  });
}


/**
 * Render
 */

function render(options, components, designManualJSON, queue) {

  // start static file server to be able to prerender components
  if (typeof options.prerender === 'object' && options.prerender !== null) {
    const serve = serveStatic(path.resolve(options.prerender.serveFolder));
    server = http.createServer((req, res) => {
      const done = finalhandler(req, res);
      serve(req, res, done);
    });

    server.listen(options.prerender.port);
    killable(server);

    server.on('listening', () => {
      nextComponent(0);
    });

    server.on('error', () => {
      done(options);
    });
  } else {
    nextComponent(0);
  }


  /**
   * Process component
   */

  function nextComponent(i) {

    if (!components.length) {
      return completeQueue([], done);
    }

    // copy old data when its a direct match
    if (queue.indexOf(components[i].meta.name) === -1) {
      let match = designManualJSON.filter((item) => {
        return (components[i].meta.name === item.meta.name);
      });

      if (match.length) {
        components[i] = match[0];
      }

      return proceed(i);
    }

    // add design manual namespace
    components[i].dm = {};

    // generate component filee
    components[i].dm.libFile = generateLibFile(components[i]);

    // get height of component using puppeteer
    renderComponent(components[i].dm.libFile, (result) => {
      components[i].dm.height = result.height;
      return proceed(i);
    });
  }


  /**
   * Proceed
   */

  function proceed(i) {
    if (i < components.length - 1) {
      nextComponent(i + 1);
    } else {
      return completeQueue(components, done);
    }
  }


  /**
   * Complete
   */

  function completeQueue(data, cb) {
    fs.writeFile(path.resolve(options.output, 'design-manual-components.json'), JSON.stringify(data), () => {
      cb(options, designManualJSON);
    });
  }
}


/**
 * Get lib file path
 */

function getLibFilePath(name) {
  const id = slug(name, { lower: true });
  const libFilePath = path.resolve(options.output, 'lib', id + '.html');
  return libFilePath;
}


/**
 * Generate lib file
 */

function generateLibFile(component) {

  const libFilePath = getLibFilePath(component.meta.name);
  const file = ['./lib/', path.basename(libFilePath)].join('');

  console.log('Rendering component ' + file);

  updatedComponents.push(component.meta.name);

  const html = LIB_TEMPLATE
    .replace('{{output}}', component.output)
    .replace('{{raw_output}}', component.output)
    .replace('{{componentHeadHtml}}', options.componentHeadHtml)
    .replace('{{componentBodyHtml}}', options.componentBodyHtml)
    .replace('{{title}}', [component.meta.name, options.meta.title, options.meta.domain].join(' - '));

  fs.writeFile(libFilePath, html, (err) => {
    if (err) throw err;
  });

  return file;
}


/**
 * Get component height
 */

function renderComponent(file, cb) {
  if (typeof options.prerender !== 'object' || options.prerender === null) {
    return cb({ height: null });
  }

  if (puppet) {
    puppet.once('message', (data) => {
      if (data.height) {
        cb({
          height: data.height
        });
      }
    });

    puppet.send({
      url: 'http://localhost:' + options.prerender.port + '/' + options.prerender.path + file
    });
  }
}


/**
 * Quit
 */

function quit() {
  if (puppet) {
    puppet.kill('SIGINT');
    puppet = null;
  }

  if (server) {
    server.kill();
  }

  process.removeListener('exit', quit);
  process.removeListener('SIGINT', quit);
}


/**
 * Done
 */

function done(options) {

  // clean up unused files
  fs.readdir(path.resolve(options.output, 'lib'), (err, files) => {

    fs.readFile(path.resolve(options.output, 'design-manual-components.json'), (err, data) => {

      const designManualJSON = JSON.parse(data);
      
      if (files) {
        for (let i = 0, l = files.length; i < l; ++i) {
          const file = files[i];
          
          const match = designManualJSON.filter((item) => {
            return (path.basename(item.dm.libFile) === file);
          });
          
          if (!match.length) {
            rimraf.sync(path.resolve(options.output, 'lib', file), { read: false });
          }
        }
      }

      quit();
      process.send(updatedComponents);
      process.exit();
    });
  });
}

ON_DEATH((signal, err) => {
  process.exit();
});