const DesignManual = require('../../../lib/index');
const collectComponents = require('collect-components');
const rimraf = require('rimraf');

collectComponents({
  url: 'https://raw.githubusercontent.com/EightMedia/collect-components/master/test/fixtures/', // http://eightmedia.github.io/design-manual/
  paths: ['capture.html'],
  output: __dirname + '/components.json',
  complete: () => {
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
        path: 'demos/comments/',
        serveFolder: 'docs/'
      },
      componentHeadHtml: `
        <base href="http://eightmedia.github.io/design-manual/">
        <link rel="stylesheet" href="all.min.css" />
        <link rel="stylesheet" href="assets/style.css" />
      `,
      onComplete: () => {
        process.exit();
      }
    });

    rimraf.sync(__dirname + '/design-manual-config.json');
  }
});