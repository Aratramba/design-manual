# Design Manual
<img src="https://raw.githubusercontent.com/EightMedia/design-manual/master/docs/assets/logo.png" align="right" height="140" />

Design Manual is a documentation platform for your websites components and design decisions.

This package combines free format Markdown files with a json file containing your components and creates a beautiful design manual. Use [Design Manual Scraper](https://github.com/EightMedia/design-manual-scraper) to feed components from your (live) website into Design Manual. See a [Live Demo](https://rijkswaterstaat.eightmedia.com/stijlgids/componenten.html) here.

* [Getting started](#getting-started)
* [Pages](#pages)
* [Options](#options)
* [Recipes](#recipes)


---

## Getting started

### Install
```bash
npm install design-manual
```

### Set up
```js
var DesignManual = require('design-manual');
new DesignManual({
  output: 'path/to/export/', // destination dir
  pages: 'path/to/pages/', // dir containing .md files
  components: 'path/to/components.json', // path to the components
  meta: {
    domain: 'my-domain.com',
    title: 'my Design Manual',
    version: 'v1.1.0'
  }
});
```

### Create your page pages using Markdown
Add markdown files for each page you want to create. For example Index.md, Components.md and Guidelines.md. See [pages](#pages) for more information.

### Create components.json
This can be done through [Design Manual Scraper](https://github.com/EightMedia/design-manual-scraper), [Pug-doc](https://github.com/Aratramba/pug-doc) or some other generator.

```json
[
  {
    "meta": {
      "name": "my-component",
      "description": "this is my component description"
    },
    "file": "path/to/file.html",
    "output": "<div class=\"some-tag\">this is some tag</div>"
  }
]
```

The `meta.description` part is optional and, if present, will be parsed using markdown.


---

## Pages
All `.md` files inside `options.pages` will be used as input. Markdown files in subdirectories will also be rendered.

A basic page looks something like this:

```markdown
# Text page
This is my text page.

## Section 1
This is section 1

## Section 2
This is section 2

### Contents
!{my-component}
!{my-other-embedded-component}

```

### Embedding components
You can embed a component in any page by typing `!{component-name}`. The tag should be an exact match of a components `meta.name` in your json file.
  
### Table of contents
The `### Contents` part is where the components table of contents will be rendered. It will contain all components after the contents heading. It will scan for components until it encounters another table of contents heading, or the end of the page.

If you want to change the text of this heading, make sure to edit the `contentsFlag` option when setting up.

### Sidebar
The h2's will be used to create in-page-links in the sidebar navigation.

### Markdown
Markdown is parsed using [marked](https://github.com/chjj/marked). HTML is allowed.


---

## Options

```js
new DesignManual({
  output: 'path/to/export/',
  pages: 'path/to/pages/',
  components: 'path/to/components.json',
  meta: {
    domain: 'mywebsite.com',
    title: 'My Design Manual',
    avatar: 'http://placehold.it/80x80',
    version: 'v1.1.0'
  },
  nav: [
    { label: 'Home', href: '/' }
  ],
  headHtml: '<script>console.log("im in the head");</script>',
  bodyHtml: '<script>console.log("im in the footer");</script>',
  contentsFlag: 'contents',
  componentHeadHtml: `
    <link rel="stylesheet" href="/assets/style.css" />
    <script>console.log("im in the component head");</script>
  `,
  componentBodyHtml: `
    <script>console.log("im in the component body");</script>
  `,
  onComplete: function() { }
});
```



| option                  | default value | type            | description                  |
|-------------------------|---------------|-----------------|------------------------------|
| __output__              | null          | string          | output directory
| __pages__               | null          | string          | directory that holds your pages 
| __components__          | null          | string          | json file with components
| __meta__                |               | object          | 
| __meta.domain__         | ''            | string          | domain for your project
| __meta.title__          | ''            | string          | title for your project
| force                   | fasle         | boolean         | force update for all components and pages
| meta.avatar             | ''            | string          | avatar for your project
| meta.version            | ''            | string          | version
| nav                     | []            | array           | array of objects with navigation items 
| - {}.label              |               | string          | label of the navigation item
| - {}.href               |               | string          | link for the navigation item
| headHtml                | ''            | string          | string of html to include in the head
| bodyHtml                | ''            | string          | string of html to include in the body
| componentHeadHtml       | ''            | string          | string of html to include in the head of the component
| componentBodyHtml       | ''            | string          | string of html to include in the body of the component
| contentsFlag            | 'contents'    | string          | css id to identify the contents heading
| renderPages             | true          | boolean         | turn rendering pages on/off
| renderComponents        | true          | boolean         | turn rendering components on/off
| renderJS                | true          | boolean         | turn rendering js on/off
| renderCSS               | true          | boolean         | turn rendering css on/off
| prerender               | null          | object || null  | prerender all components to get their heights (at 1200px wide browser window, using Electron). This speeds up the user interface and makes it less jumpy, but makes compiling Design Manual slower because it needs to open all components in a headless browser |
| prerender.port          |               | number          | static server port for rendering components (http://localhost:{port}) |
| prerender.path          |               | string          | path to design manual folder (http://localhost:{port}/{path}) |
| prerender.serveFolder   |               | string          | directory to start the static file server in |
| onComplete              | function(){}  | function        | function to be called when done


---

## Custom styling
You can customize the look and feel by adding an extra css file a style tag through the `headHtml` option:

```js
{
  headHtml: `
    <link rel="stylesheet" href="/assets/css/design-manual.css">
    <style>
      .content h1 {
        color: red;
      }
      .header {
        background-color: red;
      }
      .component.is-loading:before {
        border-top-color: red;
        border-left-color: red;
      }
      .component__meta:before {
        background-color: red;
      }
      .sidebar__nav__item__link {
        background-color: red;
      }
    </style>
  `
}
```

All pages get a body class formatted like so: `#{lowercase-slug(filename)}-page`. For example the body class for the file 'My File.md' will be `.my-file-page`.


---

## Recipes
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

gulp.task('pug-doc', function(gulpDone) {
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
    renderPages: true,
    renderComponents: true,
    renderJS: true,
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
gulp.task('design-manual', ['pug-doc'], function(gulpDone) {
  buildDesignManual(gulpDone);
});
```

