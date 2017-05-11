'use strict';
/* global require */

var LazyLoad = require('vanilla-lazyload');
var Prism = require('../libs/prism');
var iframeResizer = require('../libs/iframeResizer.min');
var delegate = require('delegate-events');
var prettyPrint = require('html').prettyPrint;
var interact = require('interact.js');
var constants = require('../constants');


if (document.querySelectorAll('.table-of-contents__list').length) {
  document.body.classList.add(constants.LOADING_CLASS);

  // enable lazy loading
  new LazyLoad({
    threshold: 100,
    elements_selector: 'iframe',
    callback_load: function($el) {
      $el.parentNode.parentNode.classList.remove('is-loading');
    },
    callback_error: function(elemen$el) {
      $el.parentNode.parentNode.classList.remove('has-error');
    }
  });

  // resize frames
  iframeResizer({ checkOrigin: false });

  // smooth scroll
  delegate.bind(document.body, '.table-of-contents__list__item__link', 'click', function(e) {
    var href = e.delegateTarget.getAttribute('href');
    var top = document.querySelector(href).offsetTop;
    window.scrollTo(0, top);
    history.pushState(null, null, href);
    e.preventDefault();
  });

  document.body.classList.remove(constants.LOADING_CLASS);


  /**
   * Capture toggle code clicks
   * and place iframe contents inside a pre tag
   */

  delegate.bind(document.body, '.js-code-toggle', 'click', onToggle);

  function onToggle(e) {
    var $component = e.target.parentNode.parentNode;
    var $pre = $component.querySelector('pre code');
    var $source = $component.querySelector('iframe');
    var html = $source.contentWindow.document.body.querySelector('.js-output').innerHTML;
    $pre.innerHTML = Prism.highlight(prettyPrint(html), Prism.languages.markup);
  }


  interact('.js-component-preview').resizable({
    edges: {
      left: false,
      right: '.js-component-preview-handle',
      bottom: false,
      top: false
    },
    onmove: function (e) {
      e.target.style.width = e.rect.width + 'px';
      e.target.classList.add(constants.RESIZING_CLASS);
      e.target.querySelector('iframe').contentWindow.parentIFrame.size();
    },
    onend: function (e) {
      e.target.classList.remove(constants.RESIZING_CLASS);
    }
  });
}