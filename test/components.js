'use strict';
/* global require */

var fs = require('fs');
var test = require('tape');
var isThere = require('is-there');
var rimraf = require('rimraf');

test('components', function(assert){

  var DesignManual = require('../index');

  var fixtures = 'test/fixtures/components/';
  var tmp = 'test/tmp/components/';
  rimraf.sync(tmp);

  new DesignManual({
    pages: fixtures,
    output: tmp,
    components: fixtures +'/components.json',
    onComplete: testOutput,
    prerenderComponents: false,
    meta: {
      domain: 'website.com',
      title: 'Design Manual'
    }
  });

  function testOutput() {
    var actual, expected;

    var files = [];
    files.push('lib/button-large.html');
    files.push('lib/button-medium.html');
    files.push('lib/button-small.html');
    files.push('lib/headings.html');
    files.push('lib/text.html');

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
  }
});