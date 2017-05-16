'use strict';
/* global require */

var delegate = require('delegate-events');
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

  if (items.length > 1) {
    document.body.classList.remove(constants.SIDEBAR_EMPTY_CLASS);
  }

  $navLinks = document.querySelectorAll('.js-sidebar__item');

  delegate.bind($sidebar, '.js-sidebar__item a', 'click', onNavLinkClick);
}


/**
 * Nav link click handler
 */


function onNavLinkClick(e) {
  var href = e.delegateTarget.getAttribute('href');
  var top = document.querySelector(href).offsetTop;
  window.scrollTo(0, top);
  history.pushState(null, null, href);
  document.getElementById('hamburger').checked = false;
  e.preventDefault();
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
    
    if ($item.getAttribute('data-rel') === e.section) {
      $item.classList.add(constants.ACTIVE_CLASS);
    } else {
      $item.classList.remove(constants.ACTIVE_CLASS);
    }
  }
}

dispatcher.on(constants.EVENT_SECTION_INVIEW, setActive);

if($sidebar){
  init();
}