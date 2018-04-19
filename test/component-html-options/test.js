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
  renderCSS: false
}

test.cb('add head html', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp/head/');


  DM.build(Object.assign({}, config, {
    output: config.output + 'head/',
    componentHeadHtml: `
      <script>alert('foo');</script>
    `,
    onComplete: function () {
      setTimeout(() => {
        let componentsHtmlFixture = fs.readFileSync(config.pages + 'component-head-html.html', 'utf8');
        let componentsHtmlTmp = fs.readFileSync(config.output + 'head/lib/component1.html', 'utf8');
        t.is(componentsHtmlFixture, componentsHtmlTmp);

        t.end();
      }, 1000);
    }
  }));
});


test.cb('add body html', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp/body/');

  DM.build(Object.assign({}, config, {
    output: config.output + 'body/',
    componentBodyHtml: `
      <script>alert('foo');</script>
    `,
    onComplete: function() {
      setTimeout(() => {
        let componentsHtmlFixture = fs.readFileSync(config.pages + 'component-body-html.html', 'utf8');
        let componentsHtmlTmp = fs.readFileSync(config.output + 'body/lib/component1.html', 'utf8');
        t.is(componentsHtmlFixture, componentsHtmlTmp);

        t.end();
      }, 1000);
    }
  }));
});