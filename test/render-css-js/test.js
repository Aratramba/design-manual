import test from 'ava';
let rimraf = require('rimraf');

let isThere = require('is-there');
let DM = require('../../lib/index');

let config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  renderComponents: false,
  renderPages: false,
  renderCSS: false,
  renderJS: false,
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

test.cb('render javascript', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    renderJS: true,
    onComplete: function() {
      t.true(isThere(config.output + 'app.min.js'), 'js exists');
      t.end();
    }
  }));
});

test.cb('don\'t render javascript', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    renderJS: false,
    onComplete: function() {
      t.true(!isThere(config.output + 'app.min.js'), 'js does not exist');
      t.end();
    }
  }));
});

test.cb('render css', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    renderCSS: true,
    onComplete: function() {
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
    onComplete: function() {
      t.true(!isThere(config.output + 'app.min.js'), 'css does not exist');
      t.end();
    }
  }));
});