import test from 'ava';
let rimraf = require('rimraf');
let fs = require('fs');

let DM = require('../../lib/index');

let config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  renderComponents: true,
  renderCSS: false,
  prerender: {
    port: 3000,
    path: '',
    serveFolder: __dirname + '/tmp/',
  },
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

test.cb('render pages with components and get their heights set', t => {
  t.plan(2);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {

        let componentsHtmlTmp = fs.readFileSync(config.output + 'page.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('scrolling="no" height="70"') > -1);
        t.truthy(componentsHtmlTmp.indexOf('scrolling="no" height="163"') > -1);

        t.end();
      }, 1000);
    }
  }));
});