'use strict';
/* global require, module, console, __dirname */

var autoprefixer = require('autoprefixer');
var browserify = require('browserify');
var assign = require('object-assign');
var electron = require('electron');
var toSentenceCase = require('to-sentence-case');
var spawn = require('child_process').spawn;
var CleanCSS = require('clean-css');
var killable = require('killable');
var postcss = require('postcss');
var sass = require('node-sass');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var marked = require('marked');
var pretty = require('pretty');
var async = require('async');
var path = require('path');
var slug = require('slug');
var pug = require('pug');
var fs = require('fs');

var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');


var LIB_TEMPLATE = `
<!DOCTYPE html>
  <html style="margin: 0; padding: 0px;">
  <head>
    <title>{{title}}</title>
    <script>
      /*! iFrame Resizer (iframeSizer.contentWindow.min.js) - v3.5.11 - 2017-03-13
       *  Desc: Include this file in any page being loaded into an iframe
       *        to force the iframe to resize to the content size.
       *  Requires: iframeResizer.min.js on host page.
       *  Copyright: (c) 2017 David J. Bradshaw - dave@bradshaw.net
       *  License: MIT
       */

      !function(a){"use strict";function b(a,b,c){"addEventListener"in window?a.addEventListener(b,c,!1):"attachEvent"in window&&a.attachEvent("on"+b,c)}function c(a,b,c){"removeEventListener"in window?a.removeEventListener(b,c,!1):"detachEvent"in window&&a.detachEvent("on"+b,c)}function d(a){return a.charAt(0).toUpperCase()+a.slice(1)}function e(a){var b,c,d,e=null,f=0,g=function(){f=Ha(),e=null,d=a.apply(b,c),e||(b=c=null)};return function(){var h=Ha();f||(f=h);var i=xa-(h-f);return b=this,c=arguments,0>=i||i>xa?(e&&(clearTimeout(e),e=null),f=h,d=a.apply(b,c),e||(b=c=null)):e||(e=setTimeout(g,i)),d}}function f(a){return ma+"["+oa+"] "+a}function g(a){la&&"object"==typeof window.console&&console.log(f(a))}function h(a){"object"==typeof window.console&&console.warn(f(a))}function i(){j(),g("Initialising iFrame ("+location.href+")"),k(),n(),m("background",W),m("padding",$),A(),s(),t(),o(),C(),u(),ia=B(),N("init","Init message from host page"),Da()}function j(){function b(a){return"true"===a?!0:!1}var c=ha.substr(na).split(":");oa=c[0],X=a!==c[1]?Number(c[1]):X,_=a!==c[2]?b(c[2]):_,la=a!==c[3]?b(c[3]):la,ja=a!==c[4]?Number(c[4]):ja,U=a!==c[6]?b(c[6]):U,Y=c[7],fa=a!==c[8]?c[8]:fa,W=c[9],$=c[10],ua=a!==c[11]?Number(c[11]):ua,ia.enable=a!==c[12]?b(c[12]):!1,qa=a!==c[13]?c[13]:qa,Aa=a!==c[14]?c[14]:Aa}function k(){function a(){var a=window.iFrameResizer;g("Reading data from page: "+JSON.stringify(a)),Ca="messageCallback"in a?a.messageCallback:Ca,Da="readyCallback"in a?a.readyCallback:Da,ta="targetOrigin"in a?a.targetOrigin:ta,fa="heightCalculationMethod"in a?a.heightCalculationMethod:fa,Aa="widthCalculationMethod"in a?a.widthCalculationMethod:Aa}function b(a,b){return"function"==typeof a&&(g("Setup custom "+b+"CalcMethod"),Fa[b]=a,a="custom"),a}"iFrameResizer"in window&&Object===window.iFrameResizer.constructor&&(a(),fa=b(fa,"height"),Aa=b(Aa,"width")),g("TargetOrigin for parent set to: "+ta)}function l(a,b){return-1!==b.indexOf("-")&&(h("Negative CSS value ignored for "+a),b=""),b}function m(b,c){a!==c&&""!==c&&"null"!==c&&(document.body.style[b]=c,g("Body "+b+' set to "'+c+'"'))}function n(){a===Y&&(Y=X+"px"),m("margin",l("margin",Y))}function o(){document.documentElement.style.height="",document.body.style.height="",g('HTML & body height set to "auto"')}function p(a){var e={add:function(c){function d(){N(a.eventName,a.eventType)}Ga[c]=d,b(window,c,d)},remove:function(a){var b=Ga[a];delete Ga[a],c(window,a,b)}};a.eventNames&&Array.prototype.map?(a.eventName=a.eventNames[0],a.eventNames.map(e[a.method])):e[a.method](a.eventName),g(d(a.method)+" event listener: "+a.eventType)}function q(a){p({method:a,eventType:"Animation Start",eventNames:["animationstart","webkitAnimationStart"]}),p({method:a,eventType:"Animation Iteration",eventNames:["animationiteration","webkitAnimationIteration"]}),p({method:a,eventType:"Animation End",eventNames:["animationend","webkitAnimationEnd"]}),p({method:a,eventType:"Input",eventName:"input"}),p({method:a,eventType:"Mouse Up",eventName:"mouseup"}),p({method:a,eventType:"Mouse Down",eventName:"mousedown"}),p({method:a,eventType:"Orientation Change",eventName:"orientationchange"}),p({method:a,eventType:"Print",eventName:["afterprint","beforeprint"]}),p({method:a,eventType:"Ready State Change",eventName:"readystatechange"}),p({method:a,eventType:"Touch Start",eventName:"touchstart"}),p({method:a,eventType:"Touch End",eventName:"touchend"}),p({method:a,eventType:"Touch Cancel",eventName:"touchcancel"}),p({method:a,eventType:"Transition Start",eventNames:["transitionstart","webkitTransitionStart","MSTransitionStart","oTransitionStart","otransitionstart"]}),p({method:a,eventType:"Transition Iteration",eventNames:["transitioniteration","webkitTransitionIteration","MSTransitionIteration","oTransitionIteration","otransitioniteration"]}),p({method:a,eventType:"Transition End",eventNames:["transitionend","webkitTransitionEnd","MSTransitionEnd","oTransitionEnd","otransitionend"]}),"child"===qa&&p({method:a,eventType:"IFrame Resized",eventName:"resize"})}function r(a,b,c,d){return b!==a&&(a in c||(h(a+" is not a valid option for "+d+"CalculationMethod."),a=b),g(d+' calculation method set to "'+a+'"')),a}function s(){fa=r(fa,ea,Ia,"height")}function t(){Aa=r(Aa,za,Ja,"width")}function u(){!0===U?(q("add"),F()):g("Auto Resize disabled")}function v(){g("Disable outgoing messages"),ra=!1}function w(){g("Remove event listener: Message"),c(window,"message",S)}function x(){null!==Z&&Z.disconnect()}function y(){q("remove"),x(),clearInterval(ka)}function z(){v(),w(),!0===U&&y()}function A(){var a=document.createElement("div");a.style.clear="both",a.style.display="block",document.body.appendChild(a)}function B(){function c(){return{x:window.pageXOffset!==a?window.pageXOffset:document.documentElement.scrollLeft,y:window.pageYOffset!==a?window.pageYOffset:document.documentElement.scrollTop}}function d(a){var b=a.getBoundingClientRect(),d=c();return{x:parseInt(b.left,10)+parseInt(d.x,10),y:parseInt(b.top,10)+parseInt(d.y,10)}}function e(b){function c(a){var b=d(a);g("Moving to in page link (#"+e+") at x: "+b.x+" y: "+b.y),R(b.y,b.x,"scrollToOffset")}var e=b.split("#")[1]||b,f=decodeURIComponent(e),h=document.getElementById(f)||document.getElementsByName(f)[0];a!==h?c(h):(g("In page link (#"+e+") not found in iFrame, so sending to parent"),R(0,0,"inPageLink","#"+e))}function f(){""!==location.hash&&"#"!==location.hash&&e(location.href)}function i(){function a(a){function c(a){a.preventDefault(),e(this.getAttribute("href"))}"#"!==a.getAttribute("href")&&b(a,"click",c)}Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'),a)}function j(){b(window,"hashchange",f)}function k(){setTimeout(f,ba)}function l(){Array.prototype.forEach&&document.querySelectorAll?(g("Setting up location.hash handlers"),i(),j(),k()):h("In page linking not fully supported in this browser! (See README.md for IE8 workaround)")}return ia.enable?l():g("In page linking not enabled"),{findTarget:e}}function C(){g("Enable public methods"),Ba.parentIFrame={autoResize:function(a){return!0===a&&!1===U?(U=!0,u()):!1===a&&!0===U&&(U=!1,y()),U},close:function(){R(0,0,"close"),z()},getId:function(){return oa},getPageInfo:function(a){"function"==typeof a?(Ea=a,R(0,0,"pageInfo")):(Ea=function(){},R(0,0,"pageInfoStop"))},moveToAnchor:function(a){ia.findTarget(a)},reset:function(){Q("parentIFrame.reset")},scrollTo:function(a,b){R(b,a,"scrollTo")},scrollToOffset:function(a,b){R(b,a,"scrollToOffset")},sendMessage:function(a,b){R(0,0,"message",JSON.stringify(a),b)},setHeightCalculationMethod:function(a){fa=a,s()},setWidthCalculationMethod:function(a){Aa=a,t()},setTargetOrigin:function(a){g("Set targetOrigin: "+a),ta=a},size:function(a,b){var c=""+(a?a:"")+(b?","+b:"");N("size","parentIFrame.size("+c+")",a,b)}}}function D(){0!==ja&&(g("setInterval: "+ja+"ms"),ka=setInterval(function(){N("interval","setInterval: "+ja)},Math.abs(ja)))}function E(){function b(a){function b(a){!1===a.complete&&(g("Attach listeners to "+a.src),a.addEventListener("load",f,!1),a.addEventListener("error",h,!1),k.push(a))}"attributes"===a.type&&"src"===a.attributeName?b(a.target):"childList"===a.type&&Array.prototype.forEach.call(a.target.querySelectorAll("img"),b)}function c(a){k.splice(k.indexOf(a),1)}function d(a){g("Remove listeners from "+a.src),a.removeEventListener("load",f,!1),a.removeEventListener("error",h,!1),c(a)}function e(b,c,e){d(b.target),N(c,e+": "+b.target.src,a,a)}function f(a){e(a,"imageLoad","Image loaded")}function h(a){e(a,"imageLoadFailed","Image load failed")}function i(a){N("mutationObserver","mutationObserver: "+a[0].target+" "+a[0].type),a.forEach(b)}function j(){var a=document.querySelector("body"),b={attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0};return m=new l(i),g("Create body MutationObserver"),m.observe(a,b),m}var k=[],l=window.MutationObserver||window.WebKitMutationObserver,m=j();return{disconnect:function(){"disconnect"in m&&(g("Disconnect body MutationObserver"),m.disconnect(),k.forEach(d))}}}function F(){var a=0>ja;window.MutationObserver||window.WebKitMutationObserver?a?D():Z=E():(g("MutationObserver not supported in this browser!"),D())}function G(a,b){function c(a){var c=/^\d+(px)?$/i;if(c.test(a))return parseInt(a,V);var d=b.style.left,e=b.runtimeStyle.left;return b.runtimeStyle.left=b.currentStyle.left,b.style.left=a||0,a=b.style.pixelLeft,b.style.left=d,b.runtimeStyle.left=e,a}var d=0;return b=b||document.body,"defaultView"in document&&"getComputedStyle"in document.defaultView?(d=document.defaultView.getComputedStyle(b,null),d=null!==d?d[a]:0):d=c(b.currentStyle[a]),parseInt(d,V)}function H(a){a>xa/2&&(xa=2*a,g("Event throttle increased to "+xa+"ms"))}function I(a,b){for(var c=b.length,e=0,f=0,h=d(a),i=Ha(),j=0;c>j;j++)e=b[j].getBoundingClientRect()[a]+G("margin"+h,b[j]),e>f&&(f=e);return i=Ha()-i,g("Parsed "+c+" HTML elements"),g("Element position calculated in "+i+"ms"),H(i),f}function J(a){return[a.bodyOffset(),a.bodyScroll(),a.documentElementOffset(),a.documentElementScroll()]}function K(a,b){function c(){return h("No tagged elements ("+b+") found on page"),document.querySelectorAll("body *")}var d=document.querySelectorAll("["+b+"]");return 0===d.length&&c(),I(a,d)}function L(){return document.querySelectorAll("body *")}function M(b,c,d,e){function f(){da=m,ya=n,R(da,ya,b)}function h(){function b(a,b){var c=Math.abs(a-b)<=ua;return!c}return m=a!==d?d:Ia[fa](),n=a!==e?e:Ja[Aa](),b(da,m)||_&&b(ya,n)}function i(){return!(b in{init:1,interval:1,size:1})}function j(){return fa in pa||_&&Aa in pa}function k(){g("No change in size detected")}function l(){i()&&j()?Q(c):b in{interval:1}||k()}var m,n;h()||"init"===b?(O(),f()):l()}function N(a,b,c,d){function e(){a in{reset:1,resetPage:1,init:1}||g("Trigger event: "+b)}function f(){return va&&a in aa}f()?g("Trigger event cancelled: "+a):(e(),Ka(a,b,c,d))}function O(){va||(va=!0,g("Trigger event lock on")),clearTimeout(wa),wa=setTimeout(function(){va=!1,g("Trigger event lock off"),g("--")},ba)}function P(a){da=Ia[fa](),ya=Ja[Aa](),R(da,ya,a)}function Q(a){var b=fa;fa=ea,g("Reset trigger event: "+a),O(),P("reset"),fa=b}function R(b,c,d,e,f){function h(){a===f?f=ta:g("Message targetOrigin: "+f)}function i(){var h=b+":"+c,i=oa+":"+h+":"+d+(a!==e?":"+e:"");g("Sending message to host page ("+i+")"),sa.postMessage(ma+i,f)}!0===ra&&(h(),i())}function S(a){function c(){return ma===(""+a.data).substr(0,na)}function d(){return a.data.split("]")[1].split(":")[0]}function e(){return a.data.substr(a.data.indexOf(":")+1)}function f(){return!("undefined"!=typeof module&&module.exports)&&"iFrameResize"in window}function j(){return a.data.split(":")[2]in{"true":1,"false":1}}function k(){var b=d();b in m?m[b]():f()||j()||h("Unexpected message ("+a.data+")")}function l(){!1===ca?k():j()?m.init():g('Ignored message of type "'+d()+'". Received before initialization.')}var m={init:function(){function c(){ha=a.data,sa=a.source,i(),ca=!1,setTimeout(function(){ga=!1},ba)}document.body?c():(g("Waiting for page ready"),b(window,"readystatechange",m.initFromParent))},reset:function(){ga?g("Page reset ignored by init"):(g("Page size reset by host page"),P("resetPage"))},resize:function(){N("resizeParent","Parent window requested size check")},moveToAnchor:function(){ia.findTarget(e())},inPageLink:function(){this.moveToAnchor()},pageInfo:function(){var a=e();g("PageInfoFromParent called from parent: "+a),Ea(JSON.parse(a)),g(" --")},message:function(){var a=e();g("MessageCallback called from parent: "+a),Ca(JSON.parse(a)),g(" --")}};c()&&l()}function T(){"loading"!==document.readyState&&window.parent.postMessage("[iFrameResizerChild]Ready","*")}if("undefined"!=typeof window){var U=!0,V=10,W="",X=0,Y="",Z=null,$="",_=!1,aa={resize:1,click:1},ba=128,ca=!0,da=1,ea="bodyOffset",fa=ea,ga=!0,ha="",ia={},ja=32,ka=null,la=!1,ma="[iFrameSizer]",na=ma.length,oa="",pa={max:1,min:1,bodyScroll:1,documentElementScroll:1},qa="child",ra=!0,sa=window.parent,ta="*",ua=0,va=!1,wa=null,xa=16,ya=1,za="scroll",Aa=za,Ba=window,Ca=function(){h("MessageCallback function not defined")},Da=function(){},Ea=function(){},Fa={height:function(){return h("Custom height calculation function not defined"),document.documentElement.offsetHeight},width:function(){return h("Custom width calculation function not defined"),document.body.scrollWidth}},Ga={},Ha=Date.now||function(){return(new Date).getTime()},Ia={bodyOffset:function(){return document.body.offsetHeight+G("marginTop")+G("marginBottom")},offset:function(){return Ia.bodyOffset()},bodyScroll:function(){return document.body.scrollHeight},custom:function(){return Fa.height()},documentElementOffset:function(){return document.documentElement.offsetHeight},documentElementScroll:function(){return document.documentElement.scrollHeight},max:function(){return Math.max.apply(null,J(Ia))},min:function(){return Math.min.apply(null,J(Ia))},grow:function(){return Ia.max()},lowestElement:function(){return Math.max(Ia.bodyOffset(),I("bottom",L()))},taggedElement:function(){return K("bottom","data-iframe-height")}},Ja={bodyScroll:function(){return document.body.scrollWidth},bodyOffset:function(){return document.body.offsetWidth},custom:function(){return Fa.width()},documentElementScroll:function(){return document.documentElement.scrollWidth},documentElementOffset:function(){return document.documentElement.offsetWidth},scroll:function(){return Math.max(Ja.bodyScroll(),Ja.documentElementScroll())},max:function(){return Math.max.apply(null,J(Ja))},min:function(){return Math.min.apply(null,J(Ja))},rightMostElement:function(){return I("right",L())},taggedElement:function(){return K("right","data-iframe-width")}},Ka=e(M);b(window,"message",S),T()}}();
      //# sourceMappingURL=iframeResizer.contentWindow.map
    </script>
    {{componentHeadHtml}}
  </head>
  <body style="margin: 0px; padding: 0px;">
    <div style="padding: 10px;" class="js-output">
      {{output}}
    </div>
    {{componentBodyHtml}}
  </body>
</html>
`;

var INFO_PAGE_CLASS = 'info-page';
var NO_HEADINGS_CLASS = 'has-no-headings';


/**
 * Init
 */

function init(options) {
  console.log('Starting design manual');
  mkdirp(options.output, function(err) {
    if (err) {
      throw err;
    }

    checkJSON(options);
  });
}

module.exports.init = init;


/**
 * Check existence of json file
 */

function checkJSON(options) {
  fs.stat(options.components, function(err, stats) {
    if (typeof stats === 'undefined') {
      throw new Error('Components json not found at' + options.components);
    }
    readFiles(options);
  });
}


/**
 * Read files
 */

function readFiles(options) {
  fs.readdir(options.pages, function(err, files) {
    var navItems = getNavigation(files, options);
    
    async.map(files, function(file, cb) {
      filterFile(file, options, cb);
    }, function(err, results) {
      finish(results, options, navItems);
    });
  });
}


/**
 * Filter with modified date
 */

function filterFile(file, options, cb) {
  var mdFile = path.resolve(options.pages, file);
  var htmlFile = path.join(options.output, getOutputFile(file));

  // compare dates of markdown and html file
  isNewer(mdFile, htmlFile, function(hasChanged) {

    // file doesn't exist, use the force
    if (hasChanged === null) {
      return cb(null, {
        file: file,
        update: options.forceUpdate
      });
    }

    // if it has been changed, do update
    if (hasChanged) {
      return cb(null, {
        file: file,
        update: true
      });
    }

    // if it hasn't been changed and it's the components page
    if (file === options.componentsPage) {

      // also check modified date of components.json
      isNewer(path.resolve(options.components), htmlFile, function(hasChanged) {
        return cb(null, {
          file: file,
          update: hasChanged
        });
      });
    } else {

      // file hasn't been changed
      return cb(null, {
        file: file,
        update: false
      });
    }
  });
}


/**
 * Finish
 */

function finish(results, options, navItems) {
  var forceUpdateAll = options.forceUpdate;

  if (!forceUpdateAll) {
    forceUpdateAll = results.some(function(item) {
      return (item.update === options.forceUpdate);
    });
  }

  if (!forceUpdateAll) {
    results = results.filter(function(item) {
      return (item.update === options.forceUpdate || item.update);
    });
  }

  if (!results.length) {
    console.log('Nothing to update');
    return;
  }

  async.series([
    function(cb) {
      processFiles(results, options, navItems, cb);
    },
    function(cb) {
      css(options, cb);
    },
    function(cb) {
      js(options, cb);
    }
  ], function(err, results) {
    console.log('Design manual complete');

    if (typeof options.onComplete === 'function') {
      options.onComplete();
    }
  });
}



/**
 * Process files
 */

function processFiles(results, options, navItems, cb) {
  async.each(results, function(result, next) {
    if (result.file !== options.componentsPage) {
      createPage(result.file, navItems, options, {}, next);
    } else {
      createComponents(result.file, navItems, options, next);
    }
  }, function(err) {
    cb();
  });
}


/**
 * Compare modified dates of two files
 */

function isNewer(a, b, cb) {
  fs.stat(a, function(err, aStats) {
    fs.stat(b, function(err, bStats) {
      var aDate = aStats.mtime.getTime();
      var bDate;
      if (typeof bStats === 'undefined') {
        return cb(null);
      } else {
        bDate = bStats.mtime.getTime();
      }
      cb(aDate > bDate);
    });
  });
}


/**
 * Generate page from markdown file
 * pass this markdown to the pug template file
 * compile pug file and save to disc
 */

function createPage(file, navItems, options, pugOptions, cb) {
  var mdFile = path.resolve(options.pages, file);
  var fileStream = fs.createReadStream(mdFile);

  fileStream.on('data', function(data) {
    var mdData = readMarkdown(data);
    renderPage(marked(data.toString()), file, navItems, mdData, options, pugOptions, cb);
  });
}

function renderPage(htmlData, file, navItems, mdData, options, pugOptions, cb) {
  var htmlFile = path.join(options.output, getOutputFile(file));

  var bodyClass = [];

  // add slugified filename to page body class
  bodyClass.push(slug(getPageName(file), { lower: true }) + '-page');

  // add info page type to page body class
  if (file !== options.indexPage && file !== options.componentsPage) {
    bodyClass.push(INFO_PAGE_CLASS);
  }

  // add body class if no headings are found
  if (!mdData.headings.length) {
    bodyClass.push(NO_HEADINGS_CLASS);
  }

  // pass locals to pug template
  var locals = assign({
    content: htmlData,
    navItems: navItems,
    pageTitle: getPageTitle(htmlFile, options.meta),
    currentPage: getPageName(file), 
    meta: options.meta,
    subnav: options.subnav,
    headHtml: options.headHtml,
    bodyHtml: options.bodyHtml,
    headings: mdData.headings,
    bodyClass: bodyClass.join(' ')
  }, pugOptions.locals || {});

  var template = pugOptions.template || __dirname +'/../template/templates/base.pug';

  // render pug file
  var html = pug.renderFile(template, locals);

  var outputStream = fs.createWriteStream(htmlFile);
  outputStream.write(html);
  outputStream.end();

  console.log('Generated '+ path.relative(process.cwd(), htmlFile));
  cb();
}


/**
 * Generate components page
 */

function createComponents(file, navItems, options, cb) {
  async.series([
    function(cb) {
      getComponentsJSON(options, cb);
    }
  ], function(err, results) {

    var libPath = path.resolve(options.output, 'lib');

    // remove 
    rimraf.sync(libPath);

    if (results.length) {
      mkdirp.sync(libPath);

      // loop over components to generate files loaded into the iframes
      var components = JSON.parse(results[0]);
      var componentsDict = {};

      // start static file server to be able to prerender components
      var server;
      if (options.prerenderComponents) {
        var serve = serveStatic(path.resolve(options.output));
        server = http.createServer(function(req, res) {
          var done = finalhandler(req, res);
          serve(req, res, done);
        });
        server.listen(options.prerenderPort);
        killable(server);
      }


      /**
       * Process component
       */

      function nextComponent(i) {

        // parse description using markdown
        if (components[i].meta.description) {
          components[i].meta.description = marked(components[i].meta.description);
        }

        // generate component filee
        components[i].libFile = generateLibFile(components[i], options, libPath);

        components[i].output = pretty(components[i].output);

        // add to dictionary
        componentsDict[slug(components[i].meta.name)] = components[i];

        // get height of component using electron
        renderComponent(components[i].libFile, options, function(result) {
          components[i].height = result.height;

          if (i < components.length - 1) {
            nextComponent(i + 1);
          } else {
            complete();
          }
        });
      }

      nextComponent(0);


      /**
       * All components are in
       * render the components page
       * - read source md file
       * - find tables of contents 
       * - and replace them with a list of links
       */

      function complete() {
        var mdFile = path.resolve(options.pages, file);
        var fileStream = fs.createReadStream(mdFile);
        fileStream.on('data', function(data) {

          var mdData = readMarkdown(data);

          // setup markdown lexer
          var lexer = new marked.Lexer({});
          var tokens = lexer.lex(data.toString());

          var isScanningList = false;
          var lastH2;
          var i;
          var l;
          var componentsContext;

          for (i = 0, l = tokens.length; i < l; i++) {

            // store the last ## h2
            if (tokens[i].type === 'heading' && tokens[i].depth === 2) {
              lastH2 = tokens[i].text;
            }

            // start scan at ### Contents
            if (tokens[i].type === 'heading' && tokens[i].text.toLowerCase() === options.contentsFlag) {
              isScanningList = true;

              // insert space instead of heading
              tokens[i] = { type: 'space' };

              // create list of components
              componentsContext = [];
            }

            // while scanning
            if (isScanningList) {

              // store list item text
              if (tokens[i].type === 'text') {

                componentsContext.push(assign({}, 
                  componentsDict[slug(tokens[i].text)],
                  {
                    'id': slug(lastH2 + '-' + tokens[i].text),
                    '404': tokens[i].text
                  })
                );
              }

              // end of list, stop scan
              if (tokens[i].type === 'list_end') {
                isScanningList = false;

                // insert table of contents and components html
                var html = pug.renderFile(__dirname +'/../template/templates/_components.pug', { 
                  components: componentsContext, 
                });

                tokens[i] = { type: 'html', pre: false, text: html };
              } else {
                tokens[i] = { type: 'space' };
              }
            }
          }

          var data = marked.parser(tokens);
          renderPage(data, file, navItems, mdData, options, {}, cb);

          if (server) {
            server.kill();
          }
        });
      }
    }
  });
}


/**
 * Get markdown headings
 */

function readMarkdown(data) {

  // setup markdown lexer
  var lexer = new marked.Lexer({});
  var tokens = lexer.lex(data.toString());

  // aggregate list of headings
  var headings = [];
  for (var i = 0, l = tokens.length; i < l; i++) {

    // find headings
    if (tokens[i].type === 'heading' && tokens[i].depth === 2) {
      headings.push({
        label: tokens[i].text,
        slug: slug(tokens[i].text, { lower: true })
      });
    }
  }

  return {
    headings: headings
  };
}


/**
 * Generate lib file
 */

function generateLibFile(component, options, libPath) {

  // generate file
  var id = slug(component.meta.name, { lower: true });
  var componentPath = path.resolve(libPath, id + '.html');
  var file = ['./lib/', path.basename(componentPath)].join('');

  var html = LIB_TEMPLATE
    .replace('{{output}}', component.output)
    .replace('{{componentHeadHtml}}', options.componentHeadHtml)
    .replace('{{componentBodyHtml}}', options.componentBodyHtml)
    .replace('{{title}}', [component.meta.name, options.meta.title, options.meta.domain].join(' - '));

  fs.writeFile(componentPath, html);

  return file;
}


/**
 * Get component height
 */

function renderComponent(file, options, cb) {
  if (!options.prerenderComponents) {
    return cb({ height: null });
  }

  console.log('- Rendering component ' + file);

  var child = spawn(electron, ['./lib/electron.js', 'http://localhost:' + options.prerenderPort + '/' + file], {
    stdio: ['ipc'],
    env: { 'DISPLAY': process.env.DISPLAY }
  });

  child.on('message', function (m) {
    cb({
      height: m
    });
  });
}


/**
 * Get the components JSON
 */

function getComponentsJSON(options, cb) {
  fs.readFile(path.resolve(options.components), function(err, data) {
    if(err) { 
      throw err;
    }

    var componentsJSON = data.toString();
    cb(null, componentsJSON);
  });
}


/**
 * Setup navigation
 */

function getNavigation(files, options) {

  // push label/link to navItems
  return files.map(function(file) {
    return {
      label: file.split('.md')[0],
      link: getOutputFile(file)
    };

  // move home to first page in navigation
  }).sort(function(a,b) {
    if(b.label === options.indexPage.split('.')[0]) {
      return 1;
    }
  }).map(function(item) {
    if (item.label === options.indexPage.split('.')[0]) {
      item.label = 'Home';
    }
    return item;
  });
}


/**
 * Get Page title / path
 */

function getPageName(filename) {
  return filename.split('.md')[0];
}

function getPageTitle(filename, meta) {
  return [toSentenceCase(path.basename(filename).split('.html')[0]), meta.title, meta.domain].join(' - ');
}

function getOutputFile(filename) {
  return slug(getPageName(filename), { lower: true }) +'.html';
}


/**
 * Generate js
 */

function js(options, cb) {
  mkdirp.sync(options.output);

  var b = browserify();
  b.add(__dirname + '/../template/scripts/index.js');
  b.transform({
    global: true
  }, 'uglifyify');
  b.bundle(function(err, buf) {
    if(err) { 
      throw err;
    }

    fs.writeFile(options.output +'/app.min.js', buf, function(err) {
      if(err) { 
        throw err;
      }

      console.log('Generated template js');
      cb();
    });
  });
}


/**
 * Generate css
 */

function css(options, cb) {
  mkdirp.sync(options.output);

  sass.render({
    file: __dirname + '/../template/styles/all.scss',
    outFile: options.output +'/all.min.css',
  }, function(err, result) { 
    if(err) { 
      throw err;
    }

    postcss([ autoprefixer ]).process(result.css).then(function (result) {

      if (options.brandColor) {
        result.css = result.css.replace(/STEELBLUE/g, options.brandColor);
      }
      
      if (options.brandColorContrast) {
        result.css = result.css.replace(/WHITESMOKE/g, options.brandColorContrast);
      }

      var cleaned = new CleanCSS().minify(result.css);
      fs.writeFile(options.output +'/all.min.css', cleaned.styles, function(err) {
        if(err) { 
          throw err;
        }

        console.log('Generated template css');
        cb();
      });
    });
  });
}