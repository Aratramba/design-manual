const recursive = require('recursive-readdir');
const path = require('path');
const fs = require('fs');


const COMPONENT_EMBED_REGEX = /([!]{1,2}|[$]{1,2}){(.*)}/g;
const COMPONENT_TYPE_PREVIEW = 'preview';
const COMPONENT_TYPE_CODE = 'code';


/**
 * Scan all markdown files to check for components
 * returns component defintion
 * 
 * !{component}
 * ${component}
 * !!{component}
 * $${component}
 * !{...autofill}
 */

function scan(dir) {
  return new Promise(resolve => {
    let components = [];

    recursive(dir, ['!*.md'], (err, files) => {
      for (let i = 0, l = files.length; i < l; ++i) {
        const mdFileData = fs.readFileSync(files[i], 'utf8');
        const matches = mdFileData.match(COMPONENT_EMBED_REGEX);
        const pageComponents = [];

        if (matches) {
          for (let ii = 0, ll = matches.length; ii < ll; ++ii) {
            const match = matches[ii];
            
            // view option
            let type;
            if (match.substr(0, 1) === '$') {
              type = COMPONENT_TYPE_CODE;
            } else {
              type = COMPONENT_TYPE_PREVIEW;
            }
            
            // frameless option
            let frameless;
            if (match.substr(0, 2) === '!!' || match.substr(0, 2) === '$$') {
              frameless = true;
            } else {
              frameless = false;
            }

            // specials: autofill
            let specials = [];
            if (match.indexOf('{...autofill}') > -1) {
              specials.push('autofill');
            }
            
            // return analysis
            pageComponents.push({
              page: path.relative(process.cwd(), files[i]),
              type: type,
              frameless: frameless,
              tag: match,
              specials: specials
            });
          }

          components = [].concat(components, pageComponents);
        }
      }
      resolve(components);
    });
  });
}

module.exports = scan;