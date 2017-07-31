var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var pages = require('./pages');
var components = require('./components');
var js = require('./assets').js;
var css = require('./assets').css;



/**
 * Init
 */

var queue = [];

function init(options) {
  console.log('Starting design manual');

  rimraf.sync(options.output + 'design-manual.json');

  mkdirp(options.output, function(err) {
    if (err) {
      throw err;
    }

    // generate components and pages if render components is set
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
      js(options.output, function() {
        queue.splice(queue.indexOf('js'), 1);
        done(options.onComplete);
      });
    }

    // generate css
    if (options.renderCSS) {
      queue.push('css');
      css(options.output, options.brandColor, options.brandColorContrast, function() {
        queue.splice(queue.indexOf('css'), 1);
        done(options.onComplete);
      });
    }

    done(options.onComplete);
  });
}

module.exports.init = init;


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
 * Generate components page
 */

function createComponents(file, navItems, options, cb) {
  async.series([
    function(cb) {
      getComponentsJSON(options, cb);
    }
  ], function(err, results) {

    var libPath = path.resolve(options.output, 'lib');

    // remove 
    rimraf.sync(libPath);

    if (results.length) {
      mkdirp.sync(libPath);

      // loop over components to generate files loaded into the iframes
      var components = JSON.parse(results[0]);
      var componentsDict = {};

      // start static file server to be able to prerender components
      var server;
      if (options.prerenderComponents) {
        var serve = serveStatic(path.resolve(options.prerender.serveFolder));
        server = http.createServer(function(req, res) {
          var done = finalhandler(req, res);
          serve(req, res, done);
        });
        server.listen(options.prerender.port);
        killable(server);
      }


      /**
       * Process component
       */

      function nextComponent(i) {

        if (!components[i]) {
          return complete();
        }

        // parse description using markdown
        if (components[i].meta.description) {
          components[i].meta.description = marked(components[i].meta.description);
        }

        // generate component filee
        components[i].libFile = generateLibFile(components[i], options, libPath);

        components[i].output = pretty(components[i].output);

        // add to dictionary
        componentsDict[slug(components[i].meta.name)] = components[i];

        // get height of component using electron
        renderComponent(components[i].libFile, options, function(result) {
          components[i].height = result.height;

          if (i < components.length - 1) {
            nextComponent(i + 1);
          } else {
            complete();
          }
        });
      }

      nextComponent(0);


      /**
       * All components are in
       * render the components page
       * - read source md file
       * - find tables of contents 
       * - and replace them with a list of links
       */

      function complete() {
        
        if (electronProcess) {
          electronProcess.send({ exit: true });
          electronProcess.kill('SIGINT');
        }

        if (server) {
          server.kill();
        }

        var mdFile = path.resolve(options.pages, file);
        var fileStream = fs.createReadStream(mdFile);
        fileStream.on('data', function(data) {

          var mdData = readMarkdown(data);

          // setup markdown lexer
          var lexer = new marked.Lexer({});
          var tokens = lexer.lex(data.toString());

          var isScanningList = false;
          var lastH2;
          var i;
          var l;
          var componentsContext;

          for (i = 0, l = tokens.length; i < l; i++) {

            // store the last ## h2
            if (tokens[i].type === 'heading' && tokens[i].depth === 2) {
              lastH2 = tokens[i].text;
            }

            // start scan at ### Contents
            if (tokens[i].type === 'heading' && tokens[i].text.toLowerCase() === options.contentsFlag.toLowerCase()) {
              isScanningList = true;

              // insert space instead of heading
              tokens[i] = { type: 'space' };

              // create list of components
              componentsContext = [];
            }

            // while scanning
            if (isScanningList) {

              // store list item text
              if (tokens[i].type === 'text') {

                componentsContext.push(assign({}, 
                  componentsDict[slug(tokens[i].text)],
                  {
                    'id': slug(lastH2 + '-' + tokens[i].text),
                    '404': tokens[i].text
                  })
                );
              }

              // end of list, stop scan
              if (tokens[i].type === 'list_end') {
                isScanningList = false;

                // insert table of contents and components html
                var html = pug.renderFile(__dirname +'/../template/templates/_components.pug', { 
                  components: componentsContext, 
                });

                tokens[i] = { type: 'html', pre: false, text: html };
              } else {
                tokens[i] = { type: 'space' };
              }
            }
          }

          var data = marked.parser(tokens);
          renderPage(data, file, navItems, mdData, options, {}, cb);
        });
      }
    }
  });
}


/**
 * Get component height
 */
 
function renderComponent(file, options, cb) {
  if (!options.prerenderComponents) {
    return cb({ height: null });
  }

  console.log('- Rendering component ' + file);

  electronProcess.once('message', function (data) {
    if (data.height) {
      cb({
        height: data.height
      });
    }
  });

  electronProcess.send({
    url: 'http://localhost:' + options.prerender.port + '/' + options.prerender.path +  file
  });
}


/**
 * Get markdown headings
 */

// function readMarkdown(data) {

//   // setup markdown lexer
//   var lexer = new marked.Lexer({});
//   var tokens = lexer.lex(data.toString());

//   // aggregate list of headings
//   var headings = [];
//   for (var i = 0, l = tokens.length; i < l; i++) {

//     // find headings
//     if (tokens[i].type === 'heading' && tokens[i].depth === 2) {
//       headings.push({
//         label: tokens[i].text,
//         slug: slug(tokens[i].text, { lower: true })
//       });
//     }
//   }

//   return {
//     headings: headings
//   };
// }


/**
 * Get the components JSON
 */

function getComponentsJSON(options, cb) {
  fs.readFile(path.resolve(options.components), function(err, data) {
    if(err) { 
      throw err;
    }

    var componentsJSON = data.toString();
    cb(null, componentsJSON);
  });
}







