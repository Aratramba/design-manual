var toSentenceCase = require('to-sentence-case');
var path = require('path');
var slug = require('slug');


/**
 * Setup navigation
 */

var navigationCache;

function getNavigation(files, pages, indexPage) {

  if (navigationCache) {
    return navigationCache;
  }

  // push label/link to navItems
  navigationCache = files.map(function(file) {
    if (path.relative(pages, file).indexOf('/') === -1) {
      return {
        label: getPageName(file),
        link: getOutputFile(file)
      };
    } else {
      return null;
    }

  // remove sub pages
  }).filter(function(item) {
    return (item !== null);

  // move home to first page in navigation
  }).sort(function(a,b) {
    if(b.label === indexPage.split('.')[0]) {
      return 1;
    }
  }).map(function(item) {
    if (item.label === indexPage.split('.')[0]) {
      item.label = 'Home';
    }
    return item;
  });

  return navigationCache;
}

module.exports.getNavigation = getNavigation;


/**
 * Get Page name, used in navigation and for file name
 */

function getPageName(filename) {
  return path.basename(filename).split('.md')[0];
}

module.exports.getPageName = getPageName;


/**
 * Get page title, used inside <title></title>
 */

function getPageTitle(filename, meta) {
  return [toSentenceCase(path.basename(filename).split('.html')[0]), meta.title, meta.domain].join(' - ');
}

module.exports.getPageTitle = getPageTitle;


/**
 * Get output file
 */

function getOutputFile(filename) {
  return slug(getPageName(filename), { lower: true }) +'.html';
}

module.exports.getOutputFile = getOutputFile;