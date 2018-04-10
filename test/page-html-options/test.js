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
  renderComponents: false,
  renderCSS: false,
  renderJS: false
}

test.cb('add head html', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    headHtml: `
      <style>
        .content h1 {
          color: inherit;
        }
        .header {
          background-color: sienna;
        }
        .component &.is-loading:before {
          border-top-color: red;
          border-left-color: red;
        }
        .component__meta:before {
          background-color: red;
        }
        .sidebar__nav__item__link {
          background-color: red;
        }
      </style>
    `,
    onComplete: function() {
      let componentsHtmlFixture = fs.readFileSync(config.pages + 'page-head-html.html', 'utf8');
      let componentsHtmlTmp = fs.readFileSync(config.output + 'page.html', 'utf8');
      t.is(componentsHtmlFixture, componentsHtmlTmp);

      t.end();
    }
  }));
});


test.cb('add body html', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    bodyHtml: `
      <script>alert('foo);</script>
    `,
    onComplete: function() {
      let componentsHtmlFixture = fs.readFileSync(config.pages + 'page-body-html.html', 'utf8');
      let componentsHtmlTmp = fs.readFileSync(config.output + 'page.html', 'utf8');
      t.is(componentsHtmlFixture, componentsHtmlTmp);

      t.end();
    }
  }));
});