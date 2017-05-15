# Design Manual
Create a living, breathing design manual / styleguide that presents all components used on your website. This package combines Markdown files with JSON containing your html snippets and creates a beautiful design manual. Each component will be placed in an iframe along with your website css/js.

Use [Design Manual Scraper](https://github.com/EightMedia/design-manual-scraper) to feed components from your (live) website into Design Manual.

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
There are two types of pages you can generate.

### Text page
A basic text page looks something like this:

```markdown
# Text page
This is my text page.

## Section 1
This is section 1

## Section 2
This is section 2
```

The h2's will be used to create a table of contents in the sidebar navigation.

Markdown is parsed using [marked](https://github.com/chjj/marked). HTML is allowed.

For the homepage, create a file called Index.md (`options.indexPage`). This will be will be placed first in the navigation.

### Components page
Create a file called Components.md (`options.componentsPage`). This page is where your components are documented. The file should look like this.

```markdown
# My Components Page
This is the components page.

---

## Section 1
This is the description of section number 1.

### Contents
* Component #1
* Other Component

---

## Section 2
This is the description of section number 2.

### Contents
* Component #2
* Other Component

---

## Section 3
This is the description of section number 3.

### Contents
* Component #1
* Component #2
* Component #3

---

## Section 4
Some other section

More content.

```
  
The `### Contents` part is where the components will be rendered. If you want to change the text of this heading, make sure to edit the `contentsFlag` option when setting up. 

The items in the list directly next to this heading will be used to look up data in your components.json, they should be an exact match of `meta.name` in your json file.

The h2's will be used to create in-page-links in the sidebar navigation.


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
  componentsPage: 'Components.md',
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
| componentsPage    | 'Components.md'   | string    | file to be the components page
| contentsFlag    | 'contents'   | string    | css id to identify the contents heading
| brandColor    | 'STEELBLUE'   | string    | overwrite default brand color
| brandColorContrast    | 'LIGHTGOLDENRODYELLOW'   | string    | overwrite default text color on brand color
| forceUpdate    | false   | boolean    | overwrite all files every time
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

All pages except for `options.indexPage` and `options.componentsPage` get the body classname `.info-page` as well.


---

## Recipes
### Gulp
Example gulp implementation with Pug doc:

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