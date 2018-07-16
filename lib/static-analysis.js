const recursive = require("recursive-readdir");
const path = require("path");
const fs = require("fs");
const constants = require("./constants");

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
  const matches = mdFileData.match(constants.COMPONENT_EMBED_REGEX);
  const components = [];

  if (matches) {
    for (let ii = 0, ll = matches.length; ii < ll; ++ii) {
      const match = matches[ii];
      const id = match.match(constants.COMPONENT_ID_REGEX)[0];

      // view option
      let type;
      if (match.substr(0, 1) === "$") {
        type = constants.COMPONENT_TYPE_CODE;
      } else {
        type = constants.COMPONENT_TYPE_PREVIEW;
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
  const matches = mdFileData.match(constants.H2_REGEX);

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

/**
 * Report for directory and list of components
 */

function report(dir, components) {
  console.log(`Design Manual report for ${dir}\n`);

  scan(dir).then(results => {
    if (results.length) {
      console.log(`${results.length} pages`);
      console.log(
        results.map(result => {
          return result.file;
        })
      );
      console.log();
    }

    const usedComponents = getScanUsedComponents(results);
    const unusedComponents = getScanUnusedComponents(results, components);

    console.log(`found ${usedComponents.size} used components`);

    if (usedComponents.size) {
      console.log([...usedComponents]);
      console.log();
    }

    console.log(`found ${unusedComponents.size} unused components`);
    if (unusedComponents.size) {
      console.log([...unusedComponents]);
      console.log();
    }
  });
}

module.exports.report = report;
