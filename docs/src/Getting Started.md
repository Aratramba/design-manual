# Getting started

1. [Install Design Manual](#install)
2. [Collect website components](#collect-website-components)
3. [Setup build](#setup-build)
4. [Write documentation pages](#write-documentation-pages)

---

## Install

First you need to install Design Manual.

```bash
> npm i design-manual --save-dev
```

---

## Collect website components
Design Manual doesn't collect the components itself, it just displays them. You need another package to get the components. There are several ways to achieve this.

* [Documentation inside your source code](#-method-1-documentation-inside-source-code)
* [Use tagged HTML comments](#-method-2-use-html-comments)
* [Scrape your site](#-method-3-scrape-your-site)

All of these methods output a json file containing HTML-snippets, which Design Manual imports. It's just a matter of where you want your component documentation to live.

---

### 💎 Method 1: Documentation inside source code
This is the preferred method, for when you have control over the source code that renders the HTML. The source code is where documentation of the components should live and be collected from. Using Pug? Use [Pug-doc](https://www.npmjs.com/package/pug-doc). Using some other renderer? Build you own and let us know. It might be as easy as transforming existing documentation JSON to match ours. As long it outputs a JSON file that looks like the example below you're good to go.


```pug
//- @pugdoc
  name: Hello world

div hello world
```

If you can't use your source code to generate components, tag comments with `@component` and use [method 2, HTML comments](#-method-2-use-html-comments).

---

### 💬 Method 2: Use HTML comments
If you're not using a static site renderer, or there is not documentation tool you can use, but do have control over the final HTML, use comments to point to the components and scrape them using [Collect Components](https://www.npmjs.com/package/collect-components).

```html
<!-- @component
  name: Hello world
-->

<div>hello world</div>
```

---

### 🔪 Method 3: Scrape your site
If you have no control whatsoever over the HTML code, use a scraper based on queryselectors, like [Gather Components](https://www.npmjs.com/package/gather-components). You can use this to build a Design Manual for a website you don't maintain yourself.


---

## Setup build
Then set up Design Manual to use this components.json as a source for your markdown files. The most miminal version looks like this:

```js
const DesignManual = require('design-manual');
DesignManual.build({
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

See [configuration](configuration.html) for more information.

---

## Write documentation pages
Add markdown files for each page you want to create. For example Index.md, Components.md and Guidelines.md

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
```

---

### Embed components
You can embed a component in any page (multiple times) by wrapping the components name in `!​{}`.
The tag should be an exact match of a components `meta.name` in your json file. Use double exclamation marks for a simpler view of the component  `!!​{}`, with buttons only visible on mouse over and without the description. For a code-first view of the component use `$​{}` or `$$​{}`


```markdown
!{component-name}
```

!{hello world}
!!{hello world}
${hello world}
$${hello world}

---

### Table of contents
Use `### Contents` to insert a components table of contents. It will contain all components coming after the contents heading. It will scan for components until it encounters another table of contents heading, or the end of the page.

If you want to change the text of this heading, edit the `contentsFlag` option when setting up.

### Markdown
Markdown is parsed using [marked](https://github.com/chjj/marked). HTML is allowed.

### Sidebar
All H2's on the page will be used to create in-page-links in the sidebar navigation.

---

### Components.json
This is what the json file containing all components should look like.

```json
[
  {
    "meta": {
      "name": "my-component",
      "description": "this is my component description"
    },
    "output": "<div class=\"some-tag\">this is some tag</div>"
  }
]
```

The `meta.description` part is optional and, if present, will be parsed using markdown.