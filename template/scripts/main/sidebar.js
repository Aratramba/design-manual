'use strict';
/* global require */

var delegate = require('delegate-events');
var dispatcher = require('./dispatcher');
var constants = require('../constants');

var $sidebar = document.querySelector('.js-sidebar');
var $navLinks = document.querySelectorAll('.js-sidebar__item');


/**
 * Internal link click handler
 */


function onLinkClick(e) {
  var href = e.delegateTarget.getAttribute('href');
  if (href && document.querySelector(href)) {
    e.preventDefault();
    var top = document.querySelector(href).getBoundingClientRect().top;
    var $header = document.querySelector('.header');
    if ($header) {
      top -= $header.getBoundingClientRect().height;
    }
    window.scrollBy(0, top - 20);
    history.replaceState(null, null, href);
    document.getElementById('hamburger').checked = false;
  }
}

delegate.bind(document.body, 'a', 'click', onLinkClick);



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