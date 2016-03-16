'use strict';
/* global require, module, console, __dirname */

var assign = require('object-assign');
var marked = require('marked');
var async = require('async');
var path = require('path');
var jade = require('jade');
var slug = require('slug');
var fs = require('fs');


// special pages
var PAGE_COMPONENTS = 'Components.md';
var PAGE_INDEX = 'Index.md';


/**
 * Generate pages
 */


function pages(options){
  fs.readdir(options.pages, function(err, files){
    var navItems = prepareNavigation(files);

    if(err){
      console.log(err);
      return;
    }

    files.forEach(function(filename){
      var filepath = path.resolve(options.pages, filename);

      switch(filename){
        case PAGE_COMPONENTS:
        createComponents(filepath, filename, options, navItems);
        break;

        default:
        createPage(filepath, filename, {}, options, navItems);
        break;
      }
    });
  });
}


/**
 * Setup navigation
 */

function prepareNavigation(files){

  // push label/link to navItems
  var navItems = files.map(function(file){
    return {
      label: file.split('.md')[0],
      link: getFilePath(file)
    };

  // move home to first page in navigation
  }).sort(function(a,b){
    if(b.label === PAGE_INDEX.split('.')[0]) {
      return 1;
    }
  }).map(function(item) {
    if (item.label === PAGE_INDEX.split('.')[0]) {
      item.label = 'Home';
    }
    return item;
  });

  console.log(navItems);

  return navItems;
}


/**
 * Get Page title / path
 */

function getPageName(filename){
  return filename.split('.md')[0];
}

function getPageTitle(filename, meta){
  return [getPageName(filename), meta.title, meta.domain].join(' - ');
}

function getFilePath(filename){
  return slug(getPageName(filename), { lower: true }) +'.html';
}


/**
 * Generate page from markdown file
 * pass this markdown to the jade template file
 * compile jade file and save to disc
 */

function createPage(filepath, filename, jadeOptions, options, navItems, cb){

  var fileStream = fs.createReadStream(filepath);
  fileStream.on('data', function(data){

    // pass locals to jade template
    var locals = assign({
      content: marked(data.toString()),
      navItems: navItems,
      pageTitle: getPageTitle(filename, options.meta),
      currentPage: getPageName(filename), 
      meta: options.meta,
      subnav: options.subnav,
      headHtml: options.headHtml,
      bodyHtml: options.bodyHtml,
      contentsId: options.contentsId
    }, jadeOptions.locals || {});

    var template = jadeOptions.template || __dirname +'/../template/templates/base.jade';

    // render jade file
    var html = jade.renderFile(template, locals);

    // write file
    var outputFile = getFilePath(filename);
    var outputStream = fs.createWriteStream(options.output +'/'+ outputFile);
    outputStream.write(html);
    outputStream.end();

    console.log('Generated '+ outputFile);

    if(cb) cb();
  });
}


/**
 * Generate components page
 */

function createComponents(filepath, filename, options, navItems){

  // get css to include inside iframe
  var websiteCss = [];
  async.each(options.websiteCss, function(file, cb){
    fs.readFile(path.resolve(file), 'utf8', function(err, data){
      if(err) throw err;
      websiteCss.push(data);
      if(cb) cb();
    });
  }, function(err){
    if(err) throw err;

    // read components json
    fs.readFile(path.resolve(options.components), function(err, data) {
      if (err) throw err;

      // setup jade locals
      var jadeOptions = {
        template: __dirname +'/../template/templates/components.jade',
        locals: {
          componentsJSON: data.toString(),
          websiteCss: websiteCss.join(''),
          componentHeadHtml: options.componentHeadHtml,
          componentBodyHtml: options.componentBodyHtml,
        }
      };

      // create components page
      createPage(filepath, filename, jadeOptions, options, navItems);
    });
  });
}

module.exports = {
  generate: pages,
  createPage: createPage
};