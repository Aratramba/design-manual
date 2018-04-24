const ON_DEATH = require('death')({ uncaughtException: true });
const recursive = require('recursive-readdir');
const marked = require('marked');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const async = require('async');
const path = require('path');
const slug = require('slug');
const pug = require('pug');
const fs = require('fs');

const utils = require('./utils');

const NO_HEADINGS_CLASS = 'has-no-headings';

const COMPONENT_TEMPLATE = __dirname + '/../template/templates/_component.pug';
const TABLE_OF_CONTENTS_TEMPLATE = __dirname + '/../template/templates/_table-of-contents.pug';
const PAGE_TEMPLATE = __dirname + '/../template/templates/base.pug';

const options = JSON.parse(process.argv[2]);
const updatedComponents = options.updatedComponents || [];


/**
 * Start
 */

console.log('- Starting pages');

// read components json file
let componentsJSON;
if (options.renderComponents) {
  try {
    componentsJSON = JSON.parse(fs.readFileSync(path.resolve(options.output, 'design-manual-components.json')).toString());
  } catch (err) {
    console.log('Design Manual json not found at ' + options.components + '. Please try again.');
    process.send(0);
  }
}


/**
 * Check if a Markdown file is newer
 * than the html file. Ignore if it isnt.
 */

function ignore(mdFile, stats) {

  // if force is on, don't ignore
  if (options.force) {
    return false;
  }

  // if dir doesn't exist yet, don't ignore
  if (stats.isDirectory()) {
    return false;
  }

  const output = utils.getOutputInfo(mdFile, options.pages, options.output)

  // if no html file exists, don't ignore
  if (!fs.existsSync(output.htmlFile)) {
    return false;
  }

  // compare dates of md file and html file
  // if md file is newer, don't ignore
  const htmlStat = fs.statSync(output.htmlFile);
  if (new Date(stats.mtime) > new Date(htmlStat.mtime)) {
    return false;
  }

  // read file
  // if it contains a component, don't ignore
  if (updatedComponents.length) {
    const mdFileData = fs.readFileSync(path.resolve(options.pages, mdFile), 'utf8');
    for (let i = 0, l = updatedComponents.length; i < l; ++i) {
      if (mdFileData.indexOf(`!{${updatedComponents[i]}}`) > -1) {
        return false;
      }
    }
  }

  // default, ignore file
  return true;
}


/**
 * Loop over queue and start processing
 */

recursive(options.pages, ['!*.md', ignore], (err, files) => {

  if (files.length === 1) {
    console.log('- Found 1 changed page');
  } else {
    console.log(`- Found ${files.length} changed pages`);
  }

  if (!files.length) {
    return done();
  }

  async.map(files, (file, next) => {
    processFile(file, componentsJSON, next);
  }, () => {
    done();
  });
});


/**
 * Clean up unused html files
 */

recursive(options.pages, (err, mdFiles) => {
  let htmlFiles = [];

  for (let i = 0, l = mdFiles.length; i < l; ++i) {
    const mdFile = mdFiles[i];
    const output = utils.getOutputInfo(mdFile, options.pages, options.output)
    htmlFiles.push(output.htmlFile);
  }

  recursive(options.output, ['!*.html', path.join(options.output, '/lib/**/*.html')], (err, files) => {
    for (let i = 0, l = files.length; i < l; ++i) {
      if (htmlFiles.indexOf(files[i]) === -1) {
        rimraf.sync(files[i], { read: false });
      }
    }
  });
});



/**
 * Process file
 */

function processFile(file, componentsJSON, next) {

  let fileStream = fs.createReadStream(path.resolve(options.pages, file));
  fileStream.on('data', (data) => {

    // get file info
    const output = utils.getOutputInfo(file, options.pages, options.output)

    const directoryDepth = path.relative(options.pages, file).split('/').length;
    const directoryDepthPath = new Array(directoryDepth).join('../');


    /**
     * setup markdown lexer
     */

    const lexer = new marked.Lexer({
      gfm: true,
      tables: true,
      breaks: true
    });
    let tokens = lexer.lex(data.toString());


    /**
     * Read markdown tokens
     * to get a list of headings
     * and change list of tokens to be parsed
     */

    let headings = [];
    let tablesOfContents = [];

    for (let i = 0, l = tokens.length; i < l; i++) {

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

      const regex = /!{(.*)}/g;
      if (tokens[i].type === 'paragraph' && regex.test(tokens[i].text.trim())) {

        // change type from paragraph to html
        tokens[i].type = 'html';

        // update text to rendered html component
        tokens[i].text = tokens[i].text.replace(/!{(.*)}/g, (match, componentName) => {

          const componentSlug = slug(componentName, { lower: true });

          // find component inside componentsJSON
          let componentData = (componentsJSON || []).filter((item) => {
            if (item.meta.name === componentName) {
              return item;
            }
          })[0];

          let componentHTML;

          // if component was found in json file
          if (componentData) {

            // render component
            componentHTML = pug.renderFile(COMPONENT_TEMPLATE, {
              component: {
                slug: componentSlug,
                file: componentData.file,
                meta: {
                  name: componentData.meta.name,
                  description: componentData.meta.description
                },
                height: componentData.dm.height,
                libFile: directoryDepthPath + componentData.dm.libFile
              }
            });

            // add component to current table of contents
            if (tablesOfContents.length) {
              tablesOfContents[tablesOfContents.length - 1].components.push({
                name: componentName,
                slug: componentSlug
              });
            }

          } else {

            // render 404
            componentHTML = pug.renderFile(COMPONENT_TEMPLATE, {
              component: {
                slug: componentName
              }
            });

            // add component to current table of contents
            if (tablesOfContents.length) {
              tablesOfContents[tablesOfContents.length - 1].components.push({
                name: componentSlug,
                slug: componentSlug,
                hasError: true
              });
            }
          }

          return componentHTML;
        });
      }
    }


    /**
     * Render tables of contents
     */

    for (let i = 0, l = tablesOfContents.length; i < l; ++i) {

      const tableHTML = pug.renderFile(TABLE_OF_CONTENTS_TEMPLATE, {
        components: tablesOfContents[i].components
      });

      tokens[tablesOfContents[i].index].type = 'html';
      tokens[tablesOfContents[i].index].text = tableHTML;
    }


    /**
     * Render the page with altered content
     */

    const contentHTML = marked.parser(tokens);


    /**
     * Set body classes
     */

    let bodyClass = [];

    // add slugified filename to page body class
    bodyClass.push(slug(utils.getPageName(file), { lower: true }) + '-page');

    // add body class if no headings are found
    if (!headings.length) {
      bodyClass.push(NO_HEADINGS_CLASS);
    }


    /**
     * Generate page
     */

    mkdirp.sync(path.join(options.output, output.fileDir));

    const locals = Object.assign({
      content: contentHTML,
      navItems: options.nav,
      pageTitle: utils.getPageTitle(output.htmlFile, options.meta),
      currentPage: utils.getPageName(file),
      meta: options.meta,
      headHtml: options.headHtml,
      bodyHtml: options.bodyHtml,
      headings: headings,
      bodyClass: bodyClass.join(' '),
      rootPath: path.relative(output.htmlFile, options.output).substring(1) + '/'
    });

    const pageHTML = pug.renderFile(PAGE_TEMPLATE, locals);

    let outputStream = fs.createWriteStream(output.htmlFile);
      
    outputStream.write(pageHTML);
    outputStream.end();
    console.log('-- Generated ' + path.relative(process.cwd(), output.htmlFile));
    next();
  });
}

module.exports.processFile = processFile;


/**
 * Done
 */

function done() {
  process.send(1);
}

ON_DEATH((signal, err) => {
  process.exit();
});