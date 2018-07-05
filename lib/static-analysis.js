const recursive = require("recursive-readdir");
const path = require("path");
const fs = require("fs");

const COMPONENT_EMBED_REGEX = /([!]{1,2}|[$]{1,2}){(.*)}/g;
const COMPONENT_ID_REGEX = /(?<={).+?(?=})/g;
const COMPONENT_TYPE_PREVIEW = "preview";
const COMPONENT_TYPE_CODE = "code";
const H2_REGEX = /^#{2}(?!#)(.*)/gm;

/**
 * Scan all markdown files to check for components
 * returns component defintion
 *
 * !{component}
 * ${component}
 * !!{component}
 * $${component}
 * !{...autofill}
 *
 * returns an array with objects like:
 *
 * [
 *  {
 *    file: 'file.md',
 *    headings: ['heading 1', 'heading 2'],
 *    components: [
 *      type: 'preview', // preview|code
 *      frameless: false,
 *      tag: '!{component1}',
 *      id: 'component1',
 *      specials: [''] // only autofill is a special for now
 *    ]
 *  }
 * ]
 */

function scan(dir) {
  return new Promise(resolve => {
    let results = [];

    recursive(dir, ["!*.md"], (err, files) => {
      for (let i = 0, l = files.length; i < l; ++i) {
        const mdFileData = fs.readFileSync(files[i], "utf8");
        const pageComponents = scanPageComponents(mdFileData, files[i]);
        const headings = scanPageHeadings(mdFileData, files[i]);

        results.push({
          file: path.relative(process.cwd(), files[i]),
          headings: headings,
          components: pageComponents
        });
      }
      resolve(results);
    });
  });
}

module.exports.scan = scan;

/**
 * Scan for components
 */

function scanPageComponents(mdFileData) {
  const matches = mdFileData.match(COMPONENT_EMBED_REGEX);
  const components = [];

  if (matches) {
    for (let ii = 0, ll = matches.length; ii < ll; ++ii) {
      const match = matches[ii];
      const id = match.match(COMPONENT_ID_REGEX)[0];

      // view option
      let type;
      if (match.substr(0, 1) === "$") {
        type = COMPONENT_TYPE_CODE;
      } else {
        type = COMPONENT_TYPE_PREVIEW;
      }

      // frameless option
      let frameless;
      if (match.substr(0, 2) === "!!" || match.substr(0, 2) === "$$") {
        frameless = true;
      } else {
        frameless = false;
      }

      // specials: autofill
      let specials = [];
      if (match.indexOf("{...autofill}") > -1) {
        specials.push("autofill");
      }

      // return analysis
      components.push({
        type: type,
        frameless: frameless,
        tag: match,
        id: id,
        specials: specials
      });
    }
  }

  return components;
}

module.exports.scanPageComponents = scanPageComponents;

/**
 * Scan for H2's
 */

function scanPageHeadings(mdFileData) {
  const headings = [];
  const matches = mdFileData.match(H2_REGEX);

  if (matches) {
    for (let ii = 0, ll = matches.length; ii < ll; ++ii) {
      const match = matches[ii].split("##")[1].trim();
      headings.push(match);
    }
  }
  return headings;
}

module.exports.scanPageHeadings = scanPageHeadings;

/**
 * Return all used components in a set
 */

function getScanUsedComponents(scan) {
  function flatten(arr) {
    return Array.prototype.concat(...arr);
  }

  return new Set(
    flatten(
      scan.map(file => {
        return file.components.map(component => {
          return component.id;
        });
      })
    )
  );
}

module.exports.getScanUsedComponents = getScanUsedComponents;

/**
 * Reduce all components to a set of unused components
 */

function getScanUnusedComponents(scan, allComponents) {
  const usedComponents = getScanUsedComponents(scan);
  const unusedComponents = allComponents.filter(component => {
    return !usedComponents.has(component.meta.name);
  });

  return new Set(
    unusedComponents.map(component => {
      return component.meta.name;
    })
  );
}

module.exports.getScanUnusedComponents = getScanUnusedComponents;
