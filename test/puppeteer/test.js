import test from 'ava';
let serveStatic = require('serve-static');
let cp = require('child_process');
let http = require('http');

test('get components height', async t => {
  const height = new Promise((resolve, reject) => {

    // static file server
    var serve = serveStatic(__dirname);
    let server = http.createServer(function(req, res) {
      serve(req, res, function (err) {
        res.statusCode = err ? (err.status || 500) : 404
        res.end(err ? err.stack : 'sorry!')
      })
    });

    server.on('listening', function() {
      let puppet = cp.fork(`lib/puppeteer.js`);

      puppet.once('message', function(data) {
        if (data === 'puppeteer-ready') {
          puppet.once('message', function (data) {
            if (data.height) {
              resolve(data.height);
            }
          });
        
          puppet.send({
            url: 'http://localhost:3000/222.html'
          });
        }
      });
    });

    server.listen(3000);
  });

	t.is(await height, 222);
});