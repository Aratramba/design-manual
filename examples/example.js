const rimraf = require('rimraf');
rimraf.sync('httpdocs/*');

const dm = require('../lib/index');

function build() {
  dm.build({
    output: 'examples/httpdocs/',
    pages: 'examples/pages/',
    components: 'examples/components.json',
    meta: {
      domain: 'website.com',
      title: 'Design Manual',
      avatar: 'http://placehold.it/100x50',
      version: 'v' + require('../package.json').version
    },
    nav: [
      { label: 'Home', href: '/index.html' },
      { label: 'Components', href: '/components.html' },
      { label: 'Content Guidelines', href: '/content-guidelines.html' },
      { label: 'Design Principles', href: '/design-principles.html' }
    ],
    force: true,
    headHtml: `
      <style>
        .content h1 {
          color: inherit;
        }
        .header {
          background-color: #2A66DC;
        }
        .component &.is-loading:before {
          border-top-color: red;
          border-left-color: red;
        }
        .component__meta:before {
          background-color: red;
        }
        .sidebar__nav__item__link {
          background-color: #2A66DC;
        }
      </style>
    `,
    bodyHtml: '',
    contentsFlag: 'contents',
    componentHeadHtml: `
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    `,
    componentBodyHtml: `
    <script>
      var $hamburger = document.querySelector('.hamburger');
      var $nav = document.querySelector('.nav');
      if ($hamburger) {
        $hamburger.addEventListener('click', function(e) {
          $nav.style.display = 'block';
        });
        $nav.style.display = 'none';
      }
    </script>
    `,
    renderComponents: true,
    renderCSS: true,
    prerender: {
      port: 3000,
      path: '',
      serveFolder: 'examples/httpdocs/',
    },
    onComplete: function() {
      console.log('callback');
    }
  });
}

build();