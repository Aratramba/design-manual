# Configuration

```js
DesignManual.build({
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
  prerender: {
    port: 3000,
    path: '/design-manual/',
    serveFolder: '/httpdocs/'
  },
  onComplete: () => {},
  onLog: (msg) => {} 
});
```

---

## Options

| option                  | default value | type            | description                  |
|-------------------------|---------------|-----------------|------------------------------|
| __output__              | null          | string          | output directory |
| __pages__               | null          | string          | directory that holds your pages  |
| __components__          | null          | string          | json file with components |
| __meta__                |               | object          |  |
| __meta.domain__         | ''            | string          | domain for your project |
| __meta.title__          | ''            | string          | title for your project |
| force                   | false         | boolean         | force update for all components and pages |
| meta.avatar             | ''            | string          | avatar for your project |
| meta.version            | ''            | string          | version |
| nav                     | []            | array           | array of objects with navigation items  |
| - {}.label              |               | string          | label of the navigation item |
| - {}.href               |               | string          | link for the navigation item |
| - {}.target             |               | string          | use _blank for new window |
| headHtml                | ''            | string          | string of html to include in the head |
| bodyHtml                | ''            | string          | string of html to include in the body |
| componentHeadHtml       | ''            | string          | string of html to include in the head of the component |
| componentBodyHtml       | ''            | string          | string of html to include in the body of the component |
| contentsFlag            | 'contents'    | string          | css id to identify the contents heading |
| renderComponents        | true          | boolean         | turn rendering components on/off |
| renderCSS               | true          | boolean         | turn rendering css on/off |
| prerender               | null          | object / null  | prerender all components to get their heights (at 1200px wide browser window, using Puppeteer). This speeds up the user interface and makes it less jumpy, but makes compiling Design Manual slower because it needs to open all components in a headless browser |
| prerender.port          |               | number          | static server port for rendering components (http://localhost:{port}) |
| prerender.path          |               | string          | path to design manual folder (http://localhost:{port}/{path}) |
| prerender.serveFolder   |               | string          | directory to start the static file server in |
| onComplete              | function(){}  | function        | function to be called when done |
| onLog                   | console.log   | function        | custom logging function |

---

## Custom styling
You can customize the look and feel by adding an extra css file or a style tag through the `headHtml` option:

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