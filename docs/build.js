var DesignManual = require('../lib/index');

const scraper = require('design-manual-scraper');
const serveStatic = require('serve-static');
const http = require('http');

const serve = serveStatic(__dirname);
const server = http.createServer((req, res) => {
  serve(req, res, function (err) {
    res.statusCode = err ? (err.status || 500) : 404
    res.end(err ? err.stack : 'sorry!')
  })
});

server.on('listening', () => {
  
  scraper({
    url: 'http://localhost:8000/',
    paths: ['src/patterns.html'],
    output: 'docs/components.json',
    complete: function () {
      DesignManual.build({
        force: true,
        output: 'docs/',
        pages: 'docs/src/',
        components: 'docs/components.json',
        nav: [
          { label: '🏡', href: '/' },
          { label: 'Getting started', href: '/getting-started.html' },
          { label: 'Configuration', href: '/configuration.html' },
          { label: 'Examples', href: '/examples.html' },
          { label: 'Github', href: 'https://github.com/EightMedia/design-manual' },
        ],
        meta: {
          domain: 'eightmedia.github.io/design-manual/',
          title: 'Design Manual',
          avatar: './assets/avatar.png',
          version: 'v' + require('../package.json').version
        },
        headHtml: `
          <link rel="stylesheet" href="./assets/style.css" />
        `,
        bodyHtml: '',
        componentBodyHtml: `
          <style>
            img { display: block; }
          </style>
        `,
        prerender: {
          port: 3000,
          path: '/',
          serveFolder: 'docs/',
        },
        onComplete: () => {
          // process.exit();
        }
      });
    }
  });
});

server.listen(8000);