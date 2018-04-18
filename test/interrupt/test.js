import test from 'ava';
let fs = require('fs');
let rimraf = require('rimraf');

let isThere = require('is-there');
let DM = require('../../lib/index');

let config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

test.cb('interrupt', t => {
  t.plan(1);
  rimraf.sync(__dirname + '/tmp');

  DM.build(Object.assign({}, config, {
    onComplete: function() {
      // t.equal(1, 1);
      // t.end();
    }
  }));
  
  setTimeout(() => {
    DM.build(Object.assign({}, config, {
      onComplete: function() {
        t.equal(1, 1);
        t.end();
      }
    }));
  }, 500);
});