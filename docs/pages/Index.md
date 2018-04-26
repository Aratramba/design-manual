<div class="lead">
  <img src="./assets/logo.png" height="100" />
  <br>
  <h1>JAMstack Design System Generator</h1>
  <br>
  <a href="">Get started ›</a>
</div>

---

<div class="features">
  <div class="features__item">
    <h2>Component library</h2>
    <p>Use HTML comments on your site to document your components.</p>
  </div>
  <div class="features__item">
    <h2>Generate pages</h2>
    <p>Write markdown documentation and embed your components.</p>
  </div>
  <div class="features__item">
    <h2>Always up to date</h2>
    <p>Integrated in your build pipeline.</p>
  </div>
</div>


---

### Install

```bash
npm i design-manual design-manual-scraper --save-dev
```

### Write markdown

```md
# Design System
!{my-component1}
!{my-component2}
```

### Setup build flow

```js
const DesignManual = require('design-manual');
const scraper = require('design-manual-scraper);

// aggregate components
scraper({
  url: 'http://localhost:8000/',
  paths: ['homepage.html', 'page.html'],
  output: 'docs/tmp/components.json',
  complete: function(results) {
    DesignManual.build({
      output: 'docs/tmp/',
      pages: './',
      components: 'docs/tmp/components.json',
      meta: {
        domain: 'example.com',
        title: 'Example'
      }
    });
  }
});
```