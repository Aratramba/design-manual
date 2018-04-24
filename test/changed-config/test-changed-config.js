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
 * test if no configuration was found
 * and a forced rebuild is triggered
 */

test.cb('new config', t => {
  t.plan(1);
  rimraf.sync(config.output);

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
 * test if a previous configuration was found
 * and was equal to current config
 * and forced rebuild is not triggered
 */

test.cb('unchanged config', t => {
  t.plan(1);
  const log = [];

  DM.build(Object.assign({}, config, {
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


/**
 * test if a previous configuration was found
 * set new component config,
 * and force rebuild is triggered
 */

test.cb('changed component head html config option', t => {
  t.plan(1);
  const log = [];

  DM.build(Object.assign({}, config, {
    componentHeadHtml: 'foo',
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      const logFixture = fs.readFileSync(__dirname + '/../log-changed-config.txt', 'utf8');
      t.deepEqual(logFixture, log.join('\n'));
      t.end();
    }
  }));
});

test.cb('changed component body html config option', t => {
  t.plan(1);
  const log = [];

  DM.build(Object.assign({}, config, {
    componentBodyHtml: 'foo',
    onLog: (msg) => {
      log.push(msg);
    },
    onComplete: () => {
      const logFixture = fs.readFileSync(__dirname + '/../log-changed-config.txt', 'utf8');
      t.deepEqual(logFixture, log.join('\n'));
      t.end();
    }
  }));
});