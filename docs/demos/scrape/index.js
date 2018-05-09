const DesignManual = require('../../../lib/index');
const scraper = require('gather-components');
const rimraf = require('rimraf');

scraper({
  url: 'http://eightmedia.github.io/design-manual/',
  paths: ['index.html', 'getting-started.html'],
  components: __dirname + '/components.yaml',
  output: __dirname + '/components.json'
}).then(() => {
  DesignManual.build({
    output: __dirname,
    pages: __dirname,
    components: __dirname + '/components.json',
    nav: [
      { label: 'Homepage', href: 'index.html' }
    ],
    meta: {
      domain: 'eightmedia.github.io/design-manual/',
      title: 'Demo'
    },
    prerender: {
      port: 3000,
      path: 'demos/scrape/',
      serveFolder: 'docs/'
    },
    headHtml: `
      <link rel="stylesheet" href="/assets/style.css" />
    `,
    componentHeadHtml: `
      <base href="http://eightmedia.github.io/design-manual/">
      <link rel="stylesheet" href="all.min.css" />
      <link rel="stylesheet" href="assets/style.css" />
    `,
    onComplete: () => { }
  });

  rimraf.sync(__dirname + '/design-manual-config.json');
});