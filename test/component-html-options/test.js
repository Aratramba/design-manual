import test from 'ava';
let fs = require('fs');
let rimraf = require('rimraf');

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
  renderPages: false,
  renderCSS: false,
  renderJS: false
}

test.cb('add head html', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    componentHeadHtml: `
      <script>alert('foo');</script>
    `,
    onComplete: function() {
      setTimeout(() => {
        let componentsHtmlFixture = fs.readFileSync(config.pages + 'component-head-html.html', 'utf8');
        let componentsHtmlTmp = fs.readFileSync(config.output + 'lib/component1.html', 'utf8');
        t.is(componentsHtmlFixture, componentsHtmlTmp);

        t.end();
      }, 1000);
    }
  }));
});


test.cb('add body html', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    componentBodyHtml: `
      <script>alert('foo');</script>
    `,
    onComplete: function() {
      setTimeout(() => {
        let componentsHtmlFixture = fs.readFileSync(config.pages + 'component-body-html.html', 'utf8');
        let componentsHtmlTmp = fs.readFileSync(config.output + 'lib/component1.html', 'utf8');
        t.is(componentsHtmlFixture, componentsHtmlTmp);

        t.end();
      }, 1000);
    }
  }));
});