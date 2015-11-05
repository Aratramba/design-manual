# Design Manual (not finished)
Create a living, breathing design manual (or styleguide).


### Options

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