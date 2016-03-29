'use strict';
/* global require */

var constants = require('../constants');
var Component = require('./component');
var TOC = require('./table-of-contents');
var queue = [];

document.body.classList.add(constants.LOADING_CLASS);

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

queue.forEach(function(component) {
  component.$el.innerHTML = component.html;
  component.$wrapper.appendChild(component.$el);
});

// document.body.classList.remove(constants.LOADING_CLASS);