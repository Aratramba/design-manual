const test = require('ava');
const rimraf = require('rimraf');
const fs = require('fs');

const DM = require('../../lib/index');

const config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  renderComponents: true,
  renderCSS: false,
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

test.cb('render pages without components', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp/no-components/');

  DM.build(Object.assign({}, config, {
    output: config.output + 'no-components/',
    renderComponents: false,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let expected = fs.readFileSync(config.pages + 'page-no-components.html', 'utf8');
        let actual = fs.readFileSync(config.output + 'no-components/page.html', 'utf8');
        t.is(expected, actual);
        t.end();
      }, 1000);
    }
  }));
});

test.cb('render pages with components', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp/components/');

  DM.build(Object.assign({}, config, {
    output: config.output + 'components/',
    renderComponents: true,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let expected = fs.readFileSync(config.pages + 'page-components.html', 'utf8');
        let actual = fs.readFileSync(config.output + 'components/page.html', 'utf8');
        t.is(expected, actual);
        t.end();
      }, 1000);
    }
  }));
});