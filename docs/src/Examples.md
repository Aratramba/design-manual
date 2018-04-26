# Examples

## Demo
* [Rijkswaterstaat](https://rijkswaterstaat.eightmedia.nl/stijlgids)
* [Hogeschool Utrecht](https://hu.eightmedia.nl)
* [Saxion Hogeschool](https://saxion.eightmedia.nl)

---

### Gulp
Example gulp implementation with Pug-doc:

```pug
//- @pugdoc
  name: My Button

button.btn Click Me!
```

```js
var gulp = require('gulp');
var pugDoc = require('pug-doc');
var DesignManual = require('design-manual');
```

```js
gulp.watch('src/**/*.pug', ['templates', ['design-manual']]);
gulp.watch('design-manual/**/*.md', ['design-manual']);
```

```js
/**
 * Pug Doc
 */

gulp.task('pug-doc', (gulpDone) => {
  pugDoc({
    input: paths.SRC.templates + '**/*.pug',
    output: paths.DEST.styleguide + 'pugdoc.json',
    complete: gulpDone
  });
});
```

```js
/**
 * Design Manual
 */

function buildDesignManual(cb) {
  DesignManual.build({
    output: 'httpdocs/design-manual/',
    components: 'httpdocs/design-manual/pugdoc.json',
    pages: 'src/design-manual',
    meta: {
      domain: '',
      title: 'Design Manual',
      avatar: 'http://placehold.it/80x80',
      version: 'v' + require('../../package.json').version
    },
    nav: [
      { label: 'Home', href: '/index.html' },
      { label: 'Components', href: '/components.html' }
    ],
    renderComponents: true,
    renderCSS: true,
    prerender: {
      port: 3000,
      path: '',
      serveFolder: 'examples/httpdocs/',
    },
    onComplete: cb
  });
}
```

```js
gulp.task('design-manual', ['pug-doc'], (gulpDone) => {
  buildDesignManual(gulpDone);
});
```