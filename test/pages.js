'use strict';
/* global require, __dirname */

var test = require('tape');
var isThere = require('is-there');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

const DIR = __dirname +'/tmp/';
const PAGES_DIR = __dirname +'/fixtures/pages/';


/**
 * check if a page is being generated
 */

rimraf(DIR, function(){
  mkdirp.sync(DIR);

  test('pages', function(assert){
    assert.plan(1);

    var options = {
      output: DIR,
      meta: {
        domain: 'website.com',
        title: 'Style Guide',
        avatar: 'http://placehold.it/80x80'
      }
    };

    var pages = require('../lib/pages');
    pages.createPage(PAGES_DIR +'Index.md', 'Home', {}, options, [], function(){

      var actual = isThere(__dirname +'/tmp/home.html');
      var expected = true;
      assert.equal(actual, expected, 'page should be generated');
      assert.end();
    });
  });
});