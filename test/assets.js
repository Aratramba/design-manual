'use strict';
/* global require, __dirname */

var test = require('tape');
var isThere = require('is-there');
var rimraf = require('rimraf');

const DIR = __dirname +'/tmp/';


/**
 * check if assets are being generated
 */

rimraf(DIR, function(){
  test('css', function(assert){
    assert.plan(1);

    var assets = require('../lib/assets');
    assets.css({ output: DIR }, function(){

      var actual = isThere(DIR +'all.min.css');
      var expected = true;
      assert.equal(actual, expected, 'css should be generated');
      assert.end();
    });
  });

  test('js', function(assert){
    assert.plan(1);

    var assets = require('../lib/assets');
    assets.js({ output: DIR }, function(){

      var actual = isThere(DIR +'app.min.js');
      var expected = true;
      assert.equal(actual, expected, 'js should be generated');
      assert.end();
    });
  });
});