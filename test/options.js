'use strict';
/* global require */

var fs = require('fs');
var test = require('tape');
var isThere = require('is-there');
var rimraf = require('rimraf');

test('options', function(assert){

  var DesignManual = require('../index');

  var fixtures = 'test/fixtures/options/';
  var tmp = 'test/tmp/options/';
  rimraf.sync(tmp);

  new DesignManual({
    forceUpdate: false,
    output: tmp,
    pages: fixtures,
    components: fixtures + 'components.json',
    onComplete: testOutput,
    meta: {
      domain: 'website.com',
      title: 'Design Manual',
      avatar: 'http://placehold.it/100x50',
      version: 'x.x.x'
    },
    headHtml: `
    <script>
      console.log('extra head html');
    </script>
    `,
    bodyHtml: `
    <script>
      console.log('extra body html');
    </script>
    `,
    contentsFlag: 'Contents Flag',
    componentHeadHtml: `
      <script>
        console.log('extra component head html');
      </script>
    `,
    componentBodyHtml: `
    <script>
      console.log('extra component body html');
    </script>
    `,
    indexPage: 'Home.md',
    prerender: {
      port: 3000,
      path: '',
      serveFolder: tmp,
    },
  });

  function testOutput() {
    var actual, expected;

    var files = [];
    files.push('lib/button-large.html');
    files.push('lib/button-medium.html');
    files.push('lib/button-small.html');
    files.push('lib/headings.html');
    files.push('lib/text.html');
    files.push('items.html');
    files.push('home.html');
    files.push('design-principles.html');
    files.push('content-guidelines.html');
    files.push('sub/page.html');

    for (var i = 0, l = files.length; i < l; ++i) {

      // check libfile generated
      actual = isThere(tmp + files[i]);
      expected = true;
      assert.equal(actual, expected, 'file generated: ' + files[i]);

      // check output
      actual = fs.readFileSync(tmp + files[i]).toString();
      expected = fs.readFileSync(fixtures + files[i]).toString();
      assert.equal(actual, expected, 'source is correct: ' + files[i]);
    }

    assert.end();

    process.exit(0);
  }
});