'use strict';
/* global require */

var test = require('tape');
var isThere = require('is-there');
var rimraf = require('rimraf');

test('defaults', function(assert){

  var DesignManual = require('../index');

  var fixtures = 'test/fixtures/defaults/';
  var tmp = 'test/tmp/defaults/';
  rimraf.sync(tmp);

  new DesignManual({
    pages: fixtures,
    output: tmp,
    components: fixtures +'/components.json',
    onComplete: testOutput,
    meta: {
      domain: 'website.com',
      title: 'Design Manual'
    }
  });

  function testOutput() {
    var actual, expected;

    actual = isThere(tmp + 'all.min.css');
    expected = true;
    assert.equal(actual, expected, 'css file generated');

    actual = isThere(tmp + 'app.min.js');
    expected = true;
    assert.equal(actual, expected, 'js file generated');

    actual = isThere(tmp + 'index.html');
    expected = true;
    assert.equal(actual, expected, 'html file generated');

    actual = isThere(tmp + 'components.html');
    expected = true;
    assert.equal(actual, expected, 'components file generated');

    assert.end();
  }
});