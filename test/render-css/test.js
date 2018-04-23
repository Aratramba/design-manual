import test from 'ava';
let rimraf = require('rimraf');

let isThere = require('is-there');
let DM = require('../../lib/index');

let config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  renderComponents: false,
  renderCSS: false,
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

test.cb('render css', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    renderCSS: true,
    onLog: () => { },
    onComplete: () => {
      t.true(isThere(config.output + 'all.min.css'), 'css exists');
      t.end();
    }
  }));
});

test.cb('don\'t render css', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    renderCSS: false,
    onLog: () => { },
    onComplete: () => {
      t.true(!isThere(config.output + 'app.min.js'), 'css does not exist');
      t.end();
    }
  }));
});