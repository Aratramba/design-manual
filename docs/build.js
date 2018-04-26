var DesignManual = require('../lib/index');

DesignManual.build({
  force: true,
  output: 'docs/',
  pages: 'docs/pages/',
  components: 'docs/components.json',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Getting started', href: '/getting-started.html' },
    { label: 'Github', href: 'https://github.com/EightMedia/design-manual' },
  ],
  meta: {
    domain: 'github.com/eightmedia/design-manual',
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
    path: '',
    serveFolder: process.cwd(),
  },
});