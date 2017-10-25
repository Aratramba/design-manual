var toSentenceCase = require('to-sentence-case');
var path = require('path');
var slug = require('slug');


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


/**
 * Get output info
 */

function getOutputInfo(file, pagesDir, outputDir) {
  var fileName = getOutputFile(file);
  var fileDir = path.dirname(path.relative(pagesDir, file));
  var htmlFile = path.join(outputDir, fileDir, fileName);

  return {
    fileName: fileName,
    fileDir: fileDir,
    htmlFile: htmlFile,
  }
}

module.exports.getOutputInfo = getOutputInfo;