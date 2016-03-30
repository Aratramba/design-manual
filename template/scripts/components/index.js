'use strict';
/* global require */

var constants = require('../constants');
var Component = require('./component');
var TOC = require('./table-of-contents');
var iframeResizer = require('../libs/iframeResizer.min');
var queue = [];

/**
 * Setup components page
 * loops over all headings with id #contents
 * and finds the next unordered list
 * kicks of table of contents and component.
 */

var elements = document.querySelectorAll(window.CONTENTS_ID +' + ul');
var i = 0;
var l = elements.length;

for(; i<l; ++i){

  // create component
  var components = new Component(elements[i]);
  queue.push(components);

  // create table of contents
  new TOC(elements[i]);

  // remove original list
  elements[i].parentNode.removeChild(elements[i]);
}

// flatten
queue = [].concat.apply([], queue);


/**
 * Create render loop
 * Uses requestAnimationFrame to create
 * a smooth loading experience
 */

var current = 0;
function next() {
  var component = queue[current];
  component.$el.innerHTML = component.html;
  component.$wrapper.appendChild(component.$el);

  iframeResizer({ checkOrigin: false });

  current++;
  if (queue[current]) {
    window.requestAnimationFrame(next);
  } else {
    document.body.classList.remove(constants.LOADING_CLASS);
  }
}

if (queue.length) {
  document.body.classList.add(constants.LOADING_CLASS);
  next();
}