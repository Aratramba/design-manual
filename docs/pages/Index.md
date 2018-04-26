<div class="lead">
  <img src="./assets/logo.png" height="100" />
  <br>
  <h1>JAMstack Design System Generator</h1>
  <br>
  <a href="">Get started ›</a>
</div>

!!{hello world}

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
> npm i design-manual design-manual-scraper --save-dev
```

### Setup

```js
const DesignManual = require('design-manual');
const scraper = require('design-manual-scraper);

// aggregate components
scraper({
  url: 'http://localhost:8000/',
  paths: ['homepage.html', 'page.html'],
  output: 'docs/components.json',
  complete: function(results) {
    DesignManual.build({
      output: 'docs/',
      pages: './',
      components: 'docs/components.json',
      meta: {
        domain: 'example.com',
        title: 'Example'
      }
    });
  }
});
```

### Write HTML

```html
  <!-- @component
    name: hello world
    description: This is my first component
  -->

  <img src="https://assets.imgix.net/examples/butterfly.jpg?px=50&w=1200&h=50&fit=crop" alt="" />
```

### Write markdown

```md
!{hello world}
```

```bash
> Starting design manual
> Starting components
> Found 1 changed component
> Rendering component ./lib/hello-world.html
> Generated components
> Starting pages
> Found 1 changed page
> Generated docs/index.html
> Generated pages
> Design manual complete
```
---

!{hello world}