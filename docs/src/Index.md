<div class="lead">
  <img src="./assets/logo.png" height="100" />
  <br>
  <h1>Lightweight Design System Generator</h1>
  <br>
  <a href="./getting-started.html">Get started ›</a>
</div>

!!{hello world}

<div class="features">
  <div class="features__item">
    <h2>Component library</h2>
    <p>Mix documentation with real life components to get an active representation of your websites components.</p>
  </div>
  <div class="features__item">
    <h2>Free form markdown</h2>
    <p>Write your pages in free form markdown and embed your `!​{components}` wherever you want, as often as you want. No limits.</p>
  </div>
  <div class="features__item">
    <h2>Fits the way you work</h2>
    <p>Use your source code documentation, HTML comments or a web scraper to collect components. No need to write markup or code any different.</p>
  </div>
</div>

---

### [NPM Install](https://www.npmjs.com/package/design-manual)

```bash
> npm i design-manual collect-components --save-dev
```

### [Tag your HTML components](./getting-started.html#collect-website-components)

```html
  <!-- @component
    name: hello world
    description: This is my first component
  -->

  <img src="https://assets.imgix.net/examples/butterfly.jpg?px=50&w=1200&h=50&fit=crop" alt="" />
```

### [Embed components in markdown](./getting-started.html#write-documentation-pages)

```md
!{hello world}
```

### [Build](./examples.html#implementation)

```js
const DesignManual = require('design-manual');
const collectComponents = require('collect-components');

// gather components
collectComponents({
  url: 'http://localhost:8000/',
  paths: ['homepage.html', 'page.html'],
  output: 'docs/components.json',
  complete: function() {
    
    // build design manual
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

!{hello world}