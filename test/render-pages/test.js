import test from 'ava';
let rimraf = require('rimraf');
let fs = require('fs');

let DM = require('../../lib/index');

let config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  renderComponents: true,
  renderPages: true,
  renderCSS: false,
  renderJS: false,
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

test.cb('render pages without components', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    renderPages: true,
    renderComponents: false,
    onComplete: function() {
      setTimeout(() => {
        let expected = fs.readFileSync(config.pages + 'page-no-components.html', 'utf8');
        let actual = fs.readFileSync(config.output + 'page.html', 'utf8');
        t.is(expected, actual);
        t.end();
      }, 1000);
    }
  }));
});

test.cb('render pages with components', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    renderPages: true,
    renderComponents: true,
    onComplete: function() {
      setTimeout(() => {
        let expected = fs.readFileSync(config.pages + 'page-components.html', 'utf8');
        let actual = fs.readFileSync(config.output + 'page.html', 'utf8');
        t.is(expected, actual);
        t.end();
      }, 1000);
    }
  }));
});