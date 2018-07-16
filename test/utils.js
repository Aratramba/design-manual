const DM = require("../lib/index");

/**
 * Build Design Manual
 * and match log output to expected test result
 */

module.exports.buildAndMatchLogs = function(t, config, expected, cb) {
  const LOGGING = false;

  if (LOGGING && t) console.log(t.title);

  const log = [];
  DM.build(
    Object.assign(config, {
      onLog: msg => {
        log.push(msg);
        if (LOGGING) console.log(msg);
      },
      onComplete: () => {
        if (LOGGING) console.log("");

        if (typeof t !== "undefined" && expected) {
          expected = expected
            .split("\n")
            .map(str => str.trim())
            .filter(str => Boolean(str.length));

          t.deepEqual(expected.sort(), log.sort());
          t.end();
        }

        if (cb) cb();
      }
    })
  );
};
