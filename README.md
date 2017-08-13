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
All `.md` files inside `options.pages` will be used as input. Markdown files in subdirectories will be rendered, but won't show up in the navigation.

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

### Homepage
For the homepage, create a file called Index.md (`options.indexPage`). This will be placed first in the navigation.


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
  subnav: [
    {
      domain: 'google.com',
      title: 'Title',
      href: 'http://www.google.com',
      avatar: 'http://placehold.it/80x80'
    },
    {
      domain: 'google.com',
      title: 'Title',
      href: 'http://www.google.com',
      avatar: 'http://placehold.it/80x80'
    }
  ],
  headHtml: '<script>console.log("im in the head");</script>',
  bodyHtml: '<script>console.log("im in the footer");</script>',
  contentsFlag: 'contents',
  indexPage: 'Index.md',
  componentHeadHtml: `
    <link rel="stylesheet" href="/assets/style.css" />
    <script>console.log("im in the component head");</script>
  `,
  componentBodyHtml: `
    <script>console.log("im in the component body");</script>
  `,
  brandColor: 'red',
  brandColorContrast: 'yellow',
  forceUpdate: true,
  onComplete: function() { }
});
```



| option        | default value | type      | description                  |
|---------------|---------------|-----------|------------------------------|
| output        | './httpdocs/' | string    | output directory
| pages         | ''            | string    | directory that holds your pages 
| components    | ''            | string    | json file with components
| meta          |               | object    | 
| meta.domain   | ''            | string    | domain for your project
| meta.title    | ''            | string    | title for your project
| meta.avatar   | ''            | string    | avatar for your project
| meta.version  | ''            | string    | version
| subnav        | []            | array     | array of objects that populate the dropdown navigation with sub projects
| - {}.domain   |               | string    | domain for project
| - {}.title    |               | string    | title of project
| - {}.href     |               | string    | link to project
| - {}.avatar   |               | string    | 80x80 image for project
| headHtml      | ''            | string    | string of html to include in the head
| bodyHtml    | ''            | string    | string of html to include in the body
| componentHeadHtml      | ''            | string    | string of html to include in the head of the component
| componentBodyHtml    | ''            | string    | string of html to include in the body of the component
| indexPage    | 'Index.md'   | string    | file to be the homepage (first item in navigation)
| contentsFlag    | 'contents'   | string    | css id to identify the contents heading
| brandColor    | 'STEELBLUE'   | string    | overwrite default brand color
| brandColorContrast    | 'LIGHTGOLDENRODYELLOW'   | string    | overwrite default text color on brand color
| forceUpdate    | false   | boolean    | overwrite all files every time
| prerender | | object || null | prerender all components to get their heights (at 1200px wide browser window, using Electron). This speeds up the user interface and makes it less jumpy, but makes compiling Design Manual slower because it needs to open all components in a headless browser |
| prerender.port | 8000 | number | static server port for rendering components (http://localhost:{port}) |
| prerender.path | '' | string | path to design manual folder (http://localhost:{port}/{path}) |
| prerender.serveFolder | './' | string | directory to start the static file server in |
| onComplete    |    | function    | function to be called when done


---

## Custom styling
You can customize the look and feel by adding an extra css file through the `headHtml` option:

```js
{
  headHtml: `
    <link rel="stylesheet" href="/assets/css/design-manual.css">
  `
}
```

All pages get a body class formatted like so: `#{lowercase-slug(filename)}-page`. For example the body class for the file 'My File.md' will be `.my-file-page`.

All pages except for `options.indexPage` get the body classname `.info-page` as well.


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
gulp.watch('./design-manual/**/*.md', ['design-manual']);
gulp.task('watch', function() {
  gulp.watch('templates/**/*.jade', ['templates','design-manual']);
});

gulp.task('design-manual', function(gulpDone) {
  renderPugDoc(gulpDone);
});

function renderPugDoc(gulpDone) {
  pugDoc({
    input: 'src/templates/**/*.jade',
    output: 'design-manual/components.json',
    complete: function() {
      renderDesignManual(gulpDone)
    }
  });
}

function renderDesignManual(gulpDone) {
  new DesignManual({
    onComplete: gulpDone,
    forceUpdate: true,
    output: 'httpdocs/design-manual/',
    pages: 'design-manual/pages/',
    components: 'design-manual/components.json',
    meta: {
      domain: 'website.com',
      title: 'Website Design Manual',
      avatar: '/design-manual/avatar.png'
    },
  });
}
```
