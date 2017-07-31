var recursive = require('recursive-readdir');
var assign = require('object-assign');
var rimraf = require('rimraf');
var marked = require('marked');
var mkdirp = require('mkdirp');
var async = require('async');
var path = require('path');
var slug = require('slug');
var pug = require('pug');
var fs = require('fs');

var utils = require('./utils');

var INFO_PAGE_CLASS = 'info-page';
var NO_HEADINGS_CLASS = 'has-no-headings';

var COMPONENT_TEMPLATE = __dirname +'/../template/templates/_component.pug';
var TABLE_OF_CONTENTS_TEMPLATE = __dirname +'/../template/templates/_table-of-contents.pug';
var PAGE_TEMPLATE = __dirname +'/../template/templates/base.pug';


/**
 * Start
 */

function start(options, cb) {
  console.log('- Starting pages');

  // remove all html files
  rimraf.sync(options.output + '**/*.html');

  // read components json file
  var componentsJSON;
  try {
    componentsJSON = JSON.parse(fs.readFileSync(path.resolve(options.output, 'design-manual.json')).toString());
  } catch(err) {
    throw new Error('Design Manual json not found at' + options.components);
  }

  // find all markdown files
  recursive(options.pages, ['!*.md'], function (err, files) {

    // no files
    if (!files) {
      console.log('-- No .md files found inside ' + options.pages);
      done(cb);
    }

    // cache navigation
    utils.getNavigation(files, options.pages, options.indexPage);
      
    // loop over files
    async.map(files, function(file, next) {
      processFile(file, options, componentsJSON, next);
    }, function() {
      done(cb);
    });
  });
}

module.exports.start = start;


/**
 * Process file
 */

function processFile(file, options, componentsJSON, next) {

  var fileStream = fs.createReadStream(path.resolve(options.pages, file));
  fileStream.on('data', function(data) {

    // setup markdown lexer
    var lexer = new marked.Lexer({});
    var tokens = lexer.lex(data.toString());


    /**
     * Read markdown tokens
     * to get a list of headings
     * and change list of tokens to be parsed
     */
    
    var headings = [];
    var tablesOfContents = [];

    for (var i = 0, l = tokens.length; i < l; i++) {

      /**
       * Aggregate list of headings
       */
    
      if (tokens[i].type === 'heading' && tokens[i].depth === 2) {
        headings.push({
          label: tokens[i].text,
          slug: slug(tokens[i].text, { lower: true })
        });
      }


      /**
       * Store table of contents token index
       * and container for its components
       */
      
      if (tokens[i].type === 'heading' && tokens[i].text.toLowerCase() === options.contentsFlag.toLowerCase()) {
        tablesOfContents.push({ 
          index: i, 
          components: [] 
        });
      }


      /**
       * Alter embed codes for components
       * paragraphs like this !{component}
       * will become component html with an iframe and html source
       */

      var regex = /!{(.*)}/g;
      if (tokens[i].type === 'paragraph' && regex.test(tokens[i].text.trim())) {

        // change type from paragraph to html
        tokens[i].type = 'html';

        // update text to rendered html component
        tokens[i].text = tokens[i].text.replace(/!{(.*)}/g, function(match, componentName){

          var componentSlug = slug(componentName, { lower: true });


          // find component inside componentsJSON
          var componentData = componentsJSON.filter(function(item) {
            if (item.meta.name === componentName) {
              return item;
            }
          })[0];

          // if component was found in json file
          if (componentData) {
          
            // var render component
            var componentHTML = pug.renderFile(COMPONENT_TEMPLATE, {
              component: {
                slug: componentSlug,
                file: componentData.file,
                meta: {
                  name: componentData.meta.name,
                  description: componentData.meta.description
                },
                height: componentData.dm.height,
                libFile: componentData.dm.libFile
              }
            });

            console.log(componentData.dm.height);

            // add component to current table of contents
            if (tablesOfContents.length) {
              tablesOfContents[tablesOfContents.length - 1].components.push({
                name: componentName,
                slug: componentSlug
              });
            }
            return componentHTML;
          }
        });
      }
    }

    
    /**
     * Render tables of contents
     */
    
    for (i = 0, l = tablesOfContents.length; i < l; ++i) {

      var tableHTML = pug.renderFile(TABLE_OF_CONTENTS_TEMPLATE, {
        components: tablesOfContents[i].components
      });

      tokens[tablesOfContents[i].index].type = 'html';
      tokens[tablesOfContents[i].index].text = tableHTML;
    }


    /**
     * Render the page with altered content
     */

    var contentHTML = marked.parser(tokens);
    var fileName = utils.getOutputFile(file);
    var fileDir = path.dirname(path.relative(options.pages, file));
    var htmlFile = path.join(options.output, fileDir, fileName);


    /**
     * Set body classes
     */
    
    var bodyClass = [];

    // add slugified filename to page body class
    bodyClass.push(slug(utils.getPageName(file), { lower: true }) + '-page');

    // add info page type to page body class
    if (path.basename(file) !== options.indexPage && path.basename(file) !== options.componentsPage) {
      bodyClass.push(INFO_PAGE_CLASS);
    }

    // add body class if no headings are found
    if (!headings.length) {
      bodyClass.push(NO_HEADINGS_CLASS);
    }


    /**
     * Generate page
     */

    mkdirp.sync(path.join(options.output, fileDir));

    var locals = assign({
      content: contentHTML,
      navItems: utils.getNavigation(),
      pageTitle: utils.getPageTitle(htmlFile, options.meta),
      currentPage: utils.getPageName(file), 
      meta: options.meta,
      subnav: options.subnav,
      headHtml: options.headHtml,
      bodyHtml: options.bodyHtml,
      headings: headings,
      bodyClass: bodyClass.join(' '),
      rootPath: path.relative(htmlFile, options.output).substring(1) + '/'
    });

    var pageHTML = pug.renderFile(PAGE_TEMPLATE, locals);


    var outputStream = fs.createWriteStream(htmlFile);
    outputStream.write(pageHTML);
    outputStream.end();

    console.log('-- Generated '+ path.relative(process.cwd(), htmlFile));

    next();
  });
}

module.exports.processFile = processFile;


/**
 * Done
 */

function done(cb) {
  console.log('- Generated pages');
  cb();
}