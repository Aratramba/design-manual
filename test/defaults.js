import test from 'ava';
let fs = require('fs');

let isThere = require('is-there');
let DM = require('../lib/index');
let config = require('./fixtures/defaults/config.json');

test.cb('defaults', t => {
  t.plan(12);

  DM.build(Object.assign({}, config, {
    onComplete: function() {

      // test styles/js generated
      t.true(isThere(config.output + 'all.min.css'), 'css exists');
      t.true(isThere(config.output + 'app.min.js'), 'js exists');

      // test register files generated
      t.true(isThere(config.output + 'design-manual-components.json'), 'design manual components json exists');
      t.true(isThere(config.output + 'design-manual-config.json'), 'design manual config json exists');

      // test page generated
      t.true(isThere(config.output + 'components.html'), 'components.html exists');

      // test lib files generated
      t.true(isThere(config.output + 'lib/component1.html'), 'component1.html exists');
      t.true(isThere(config.output + 'lib/component2.html'), 'component2.html exists');
      t.true(isThere(config.output + 'lib/component3.html'), 'component3.html exists');

      // test output html
      let componentsHtmlFixture = fs.readFileSync(config.pages + 'components.html', 'utf8');
      let componentsHtmlTmp = fs.readFileSync(config.output + 'components.html', 'utf8');
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
    }
  }));
});