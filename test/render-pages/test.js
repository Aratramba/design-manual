const test = require('ava');
const rimraf = require('rimraf');
const fs = require('fs');

const DM = require('../../lib/index');

const config = {
  output: __dirname + '/tmp/',
  pages: __dirname + '/',
  components: './test/components.json',
  renderComponents: true,
  renderCSS: false,
  meta: {
    domain: 'website.com',
    title: 'Design Manual'
  }
}

test.cb('render pages without components', t => {
  t.plan(3);
  rimraf.sync(__dirname + '/tmp/');

  DM.build(Object.assign({}, config, {
    renderComponents: false,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let componentsHtmlTmp = fs.readFileSync(config.output + 'page.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('<div class="component-wrapper"><div class="component js-section has-error" id="component1"><h3 class="component__title">component1</h3><div class="component__meta"></div></div></div>') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<div class="component-wrapper"><div class="component js-section has-error" id="component2"><h3 class="component__title">component2</h3><div class="component__meta"></div></div></div>') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<div class="component-wrapper"><div class="component js-section has-error" id="component3"><h3 class="component__title">component3</h3><div class="component__meta"></div></div></div>') > -1);
        
        t.end();
      }, 1000);
    }
  }));
});

test.cb('render component', t => {
  t.plan(2);
  rimraf.sync(__dirname + '/tmp/');

  DM.build(Object.assign({}, config, {
    renderComponents: true,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let componentsHtmlTmp = fs.readFileSync(config.output + 'component.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('<div class="component js-section is-loading" id="component1">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<iframe class="component__preview__iframe" data-src="./lib/component1.html" frameborder="0" scrolling="no"></iframe>') > -1);

        t.end();
      }, 1000);
    }
  }));
});

test.cb('render component frameless', t => {
  t.plan(2);
  rimraf.sync(__dirname + '/tmp/');

  DM.build(Object.assign({}, config, {
    renderComponents: true,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {

        let componentsHtmlTmp = fs.readFileSync(config.output + 'component-frameless.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('<div class="component js-section is-loading is-frameless" id="component1">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<iframe class="component__preview__iframe" data-src="./lib/component1.html" frameborder="0" scrolling="no"></iframe>') > -1);

        t.end();
      }, 1000);
    }
  }));
});

test.cb('render code', t => {
  t.plan(3);
  rimraf.sync(__dirname + '/tmp/');

  DM.build(Object.assign({}, config, {
    renderComponents: true,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let componentsHtmlTmp = fs.readFileSync(config.output + 'code.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('<div class="component js-section is-loading" id="component1">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<iframe class="component__preview__iframe" data-src="./lib/component1.html" frameborder="0" scrolling="no"></iframe>') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<input class="component__toggle js-code-toggle" type="checkbox" name="source" id="toggle-component1" data-checked="true"') > -1);

        t.end();
      }, 1000);
    }
  }));
});

test.cb('render code frameless', t => {
  t.plan(3);
  rimraf.sync(__dirname + '/tmp/');

  DM.build(Object.assign({}, config, {
    renderComponents: true,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let componentsHtmlTmp = fs.readFileSync(config.output + 'code-frameless.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('<div class="component js-section is-loading is-frameless" id="component1">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<iframe class="component__preview__iframe" data-src="./lib/component1.html" frameborder="0" scrolling="no"></iframe>') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<input class="component__toggle js-code-toggle" type="checkbox" name="source" id="toggle-component1" data-checked="true"') > -1);
        
        t.end();
      }, 1000);
    }
  }));
});

test.cb('render table of contents', t => {
  t.plan(4);
  rimraf.sync(__dirname + '/tmp/');

  DM.build(Object.assign({}, config, {
    renderComponents: true,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let componentsHtmlTmp = fs.readFileSync(config.output + 'toc.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('<a class="table-of-contents__list__item__link" href="#component1">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<a class="table-of-contents__list__item__link" href="#component2">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<a class="table-of-contents__list__item__link" href="#component3">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<li class="table-of-contents__list__item table-of-contents__list__item--error"><a class="table-of-contents__list__item__link" href="#component4">') > -1);

        t.end();
      }, 1000);
    }
  }));
});


test.cb('render rest', t => {
  t.plan(3);
  rimraf.sync(__dirname + '/tmp/');

  DM.build(Object.assign({}, config, {
    renderComponents: true,
    onLog: () => { },
    onComplete: () => {
      setTimeout(() => {
        let componentsHtmlTmp = fs.readFileSync(config.output + 'rest.html', 'utf8');
        t.truthy(componentsHtmlTmp.indexOf('<div class="component js-section is-loading" id="component1">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<div class="component js-section is-loading" id="component2">') > -1);
        t.truthy(componentsHtmlTmp.indexOf('<div class="component js-section is-loading" id="component3">') > -1);
        t.end();
      }, 1000);
    }
  }));
});