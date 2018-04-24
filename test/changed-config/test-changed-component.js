import test from 'ava';
let rimraf = require('rimraf');
let fs = require('fs');

let DM = require('../../lib/index');

let config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  },
  renderComponents: true,
  renderCSS: false
}


/**
 * test for no changes
 */

test.cb('same components before', t => {
  rimraf.sync(config.output);

  t.plan(1);
  let log = [];

  DM.build(Object.assign({}, config, {
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      let logFixture = fs.readFileSync(__dirname + '/../log-new.txt', 'utf8');
      t.deepEqual(logFixture, log.join('\n'));
      t.end();
    }
  }));
});


/**
 * test if there is new components html
 */

test.cb('changed component', t => {

  t.plan(1);
  let log = [];

  DM.build(Object.assign({}, config, {
    components: './test/components2.json',
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      let logFixture = fs.readFileSync(__dirname + '/../log-changed-component.txt', 'utf8');
      t.deepEqual(logFixture, log.join('\n'));
      t.end();
    }
  }));
});


/**
 * test if new components are found
 */

test.cb('same components after', t => {
  t.plan(1);
  let log = [];

  DM.build(Object.assign({}, config, {
    components: './test/components2.json',
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      let logFixture = fs.readFileSync(__dirname + '/../log-no-changes.txt', 'utf8');
      t.deepEqual(logFixture, log.join('\n'));
      t.end();
    }
  }));
});