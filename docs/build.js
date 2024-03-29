const DesignManual = require('../lib/index');

const gatherComponents = require('gather-components');
const serveStatic = require('serve-static');
const http = require('http');
const cp = require('child_process');

const serve = serveStatic(__dirname);
const server = http.createServer((req, res) => {
  serve(req, res, function (err) {
    res.statusCode = err ? (err.status || 500) : 404
    res.end(err ? err.stack : 'sorry!')
  })
});

server.on('listening', () => {
  
  gatherComponents({
    url: 'http://localhost:8000/',
    paths: ['src/patterns.html'],
    components: 'docs/components.yaml',
    output: 'docs/components.json'
  }).then(() => {
    DesignManual.build({
      force: true,
      output: 'docs/',
      pages: 'docs/src/',
      components: 'docs/components.json',
      nav: [
        { label: '🏡', href: 'index.html' },
        { label: 'Getting started', href: 'getting-started.html' },
        { label: 'Configuration', href: 'configuration.html' },
        { label: 'Examples', href: 'examples.html' },
        { label: 'Github ↗', href: 'https://github.com/aratramba/design-manual', target: '_blank' },
      ],
      meta: {
        domain: 'aratramba.github.io/design-manual/',
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
        let scraper = cp.fork(`${__dirname}/demos/scrape/index.js`);
        scraper.on('exit', () => {
          let collector = cp.fork(`${__dirname}/demos/comments/index.js`);
          collector.on('exit', () => {
            if (process.argv[2] === '-q') process.exit();
          });
        })
      }
    });
  });
});

server.listen(8000);