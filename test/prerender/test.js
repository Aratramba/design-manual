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

test.cb('render pages without components', t => {
  t.plan(4);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    onComplete: function() {

      setTimeout(() => {

        // test output html
        let componentsHtmlFixture = fs.readFileSync(config.pages + 'page.html', 'utf8');
        let componentsHtmlTmp = fs.readFileSync(config.output + 'page.html', 'utf8');
        t.is(componentsHtmlFixture, componentsHtmlTmp);

        // test libfile 1 output html
        let components1HtmlFixture = fs.readFileSync(config.pages + 'lib/component1.html', 'utf8');
        let components1HtmlTmp = fs.readFileSync(config.output + 'lib/component1.html', 'utf8');
        t.is(components1HtmlFixture, components1HtmlTmp);

        // test libfile 2 output html
        let components2HtmlFixture = fs.readFileSync(config.pages + 'lib/component2.html', 'utf8');
        let components2HtmlTmp = fs.readFileSync(config.output + 'lib/component2.html', 'utf8');
        t.is(components2HtmlFixture, components2HtmlTmp);

        // test libfile 3 output html
        let components3HtmlFixture = fs.readFileSync(config.pages + 'lib/component3.html', 'utf8');
        let components3HtmlTmp = fs.readFileSync(config.output + 'lib/component3.html', 'utf8');
        t.is(components3HtmlFixture, components3HtmlTmp);

        t.end();
      }, 1000);
    }
  }));
});