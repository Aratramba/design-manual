const recursive = require('recursive-readdir');
const fs = require('fs');


const COMPONENT_EMBED_REGEX = /([!]{1,2}|[$]{1,2}){(.*)}/g;


/**
 * Scan all markdown files to check for components
 * Used for !{...autofill}
 */

function scan(dir) {
  return new Promise(resolve => {
    let components = [];

    recursive(dir, ['!*.md'], (err, files) => {
      for (var i = 0, l = files.length; i < l; ++i) {
        const mdFileData = fs.readFileSync(files[i], 'utf8');
        const matches = mdFileData.match(COMPONENT_EMBED_REGEX);
        components = [].concat(components, matches);
      }
      resolve(components);
    });
  });
}

module.exports = scan;