import test from 'ava';
let rimraf = require('rimraf');

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
      t.fail();
      t.end();
    }
  }));
  
  setTimeout(() => {
    DM.build(Object.assign({}, config, {
      onComplete: function() {
        t.pass();
        t.end();
      }
    }));
  }, 400);
  
  setTimeout(() => {
    DM.build(Object.assign({}, config, {
      onComplete: function() {
        t.fail();
        t.end();
      }
    }));
  }, 200);
});