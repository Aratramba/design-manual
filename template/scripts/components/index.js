'use strict';
/* global require */

var Component = require('./component');
var TOC = require('./table-of-contents');

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
  new Component(elements[i]);

  // create table of contents
  new TOC(elements[i]);

  // remove original list
  elements[i].parentNode.removeChild(elements[i]);
}