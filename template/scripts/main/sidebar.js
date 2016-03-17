'use strict';
/* global require */

var Mustache = require('mustache');
var dispatcher = require('./dispatcher');
var constants = require('../constants');

var TEMPLATE = document.getElementById('sidebar-link-template').innerHTML;
Mustache.parse(TEMPLATE);

var $sidebar = document.querySelector('.js-sidebar');
var $navLinks;


/**
 * Renders the in page sidebar navigation
 */

function init(){
  var headings = aggregate();
  render(headings);
}


/**
 * Find all page sections by H2
 */

function aggregate(){
  var items = {};
  var $els = document.querySelectorAll('.content h2');
  var i = 0;
  var l = $els.length;
  var id;
  for(; i<l; ++i){
    id = $els[i].id;
    if(id){
      items[$els[i].id] = {
        label: $els[i].textContent,
        id: id
      };
    }
  }

  return Object.keys(items).map(function(key){
    return items[key];
  });
}


/**
 * Render template
 */

function render(items){
  var html = Mustache.render(TEMPLATE, { items: items });
  $sidebar.innerHTML = html;

  if (!items.length) {
    document.body.classList.add(constants.SIDEBAR_EMPTY_CLASS);
  }

  $navLinks = document.querySelectorAll('.js-sidebar__item');
}


/**
 * Set active item
 */

function setActive(e){
  var i = 0;
  var l = $navLinks.length;
  var $item;

  for(; i<l; i++){
    $item = $navLinks[i];
    $item.classList.toggle(constants.ACTIVE_CLASS, ($item.getAttribute('data-rel') === e.section));
  }
}

dispatcher.on(constants.EVENT_SECTION_INVIEW, setActive);

if($sidebar){
  init();
}