'use strict';
/* global require */

var delegate = require('delegate-events');
var dispatcher = require('./dispatcher');
var constants = require('../constants');

var $sidebar = document.querySelector('.js-sidebar');
var $navLinks = document.querySelectorAll('.js-sidebar__item');


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

if ($sidebar) {
  delegate.bind($sidebar, '.js-sidebar__item a', 'click', onNavLinkClick);
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