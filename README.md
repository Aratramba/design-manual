# Design Manual (not finished)
Create a living, breathing design manual (or styleguide if you will).

## Getting started

1. ### Install
  ```bash
  npm install design-manual
  ```

2. ### Set up
  ```js
  var DesignManual = require('design-manual');
  new DesignManual({
    output: 'path/to/export/',
    pages: 'path/to/pages/',
    components: 'path/to/components.json',
    meta: {
      domain: 'my-domain.com',
      title: 'my Design Manual'
    }
  });
  ```

3. ### Create Markdown pages
  See [Creating pages](#creating-pages).

4. ### Create components.json
  This can be done through Jade-doc or some other generator. The `source` key is optional.

  ```json
  [
    {
      "meta": {
        "name": "my-component"
      },
      "file": "path/to/file.jade",
      "source": "div.some-tag\n  | this is some tag",
      "output": "<div class=\"some-tag\">this is some tag</div>"
    }
  ]
  ```


---

## Creating pages
  There are two types of pages you can generate.

  1. Text page
    A basic text page looks like this:

    ```markdown
    # Text page
    This is my text page.

    ## Section 1
    This is section 1

    ## Section 2
    This is section 2
    ```

    The h2's will be used to create links in the sidebar.

    Markdown is parsed using [marked](). HTML is allowed.

    If a file called Home.md is found, it will be placed first in the navigation.

  2. Components page
  This page is where your components live.



---

## Options

```js
new DesignManual({
  output: 'path/to/export/',
  pages: 'path/to/pages/',
  components: 'path/to/components.json',
  includeCss: ['path/to/style1.css'],
  meta: {
    domain: 'mywebsite.com',
    title: 'My Design Manual',
    avatar: 'http://placehold.it/80x80'
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
  footerHtml: '<script>console.log("im in the footer");</script>',
  contentsId: '#contents'
});
```



| option        | default value | type      | description                  |
|---------------|---------------|-----------|------------------------------|
| output        | './httpdocs/' | string    | output directory
| pages         | ''            | string    | directory that holds your pages 
| components    | ''            | string    | json file with components
| includeCss    | []            | array     | list of css files to include in components
| meta          |               | object    | 
| meta.domain   | ''            | string    | domain for your project
| meta.title    | ''            | string    | title for your project
| meta.avatar   | ''            | string    | avatar for your project
| subnav        | []            | array     | array of objects that populate the dropdown navigation with sub projects
| - {}.domain   |               | string    | domain for project
| - {}.title    |               | string    | title of project
| - {}.href     |               | string    | link to project
| - {}.avatar   |               | string    | 80x80 image for project
| headHtml      | ''            | string    | string of html to include in the head
| footerHtml    | ''            | string    | string of html to include in the footer
| contentsId    | '#contents'   | string    | css id to identify the contents heading
