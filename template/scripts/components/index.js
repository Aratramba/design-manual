'use strict';
/* global require */

var LazyLoad = require('vanilla-lazyload');
var Prism = require('../libs/prism');
var iframeResizer = require('../libs/iframeResizer.min');
var smoothScroll = require('../libs/smoothscroll');
var delegate = require('delegate-events');
var constants = require('../constants');


if (document.querySelectorAll('.table-of-contents__list').length) {
  document.body.classList.add(constants.LOADING_CLASS);
  document.body.classList.add('components-page');

  // enable lazy loading
  new LazyLoad({
    elements_selector: 'iframe',
    callback_load: function($el) {
      $el.parentNode.classList.remove('is-loading');
    },
    callback_error: function(elemen$el) {
      $el.parentNode.classList.remove('has-error');
    }
  });

  // resize frames
  iframeResizer({ checkOrigin: false });

  // syntax highlighting
  Prism.highlightAll();

  // smooth scroll
  delegate.bind(document.body, '.table-of-contents__list__item__link', 'click', function(e) {
    var href = e.delegateTarget.getAttribute('href');
    var top = document.querySelector(href).getBoundingClientRect().top - 80;
    smoothScroll(top);
  });

  document.body.classList.remove(constants.LOADING_CLASS);
}