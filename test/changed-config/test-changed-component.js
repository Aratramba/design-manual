const test = require('ava');
const rimraf = require('rimraf');
const fs = require('fs');

const DM = require('../../lib/index');

const config = {
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
  const log = [];

  DM.build(Object.assign({}, config, {
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      const logFixture = fs.readFileSync(__dirname + '/../log-new.txt', 'utf8');
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
  const log = [];

  DM.build(Object.assign({}, config, {
    components: './test/components2.json',
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      const logFixture = fs.readFileSync(__dirname + '/../log-changed-component.txt', 'utf8');
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
  const log = [];

  DM.build(Object.assign({}, config, {
    components: './test/components2.json',
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      const logFixture = fs.readFileSync(__dirname + '/../log-no-changes.txt', 'utf8');
      t.deepEqual(logFixture, log.join('\n'));
      t.end();
    }
  }));
});