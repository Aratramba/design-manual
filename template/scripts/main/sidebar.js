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

function scrollWithOffset(href) {
  var $el = document.querySelector(href);
  if ($el) {
    var top = $el.getBoundingClientRect().top;
    var $header = document.querySelector('.header');
    if ($header) {
      top -= $header.getBoundingClientRect().height;
    }
    window.scrollBy(0, top - 20);
  }
}


function onLinkClick(e) {
  var href = e.delegateTarget.getAttribute('href');

  // check if it's an anchor link
  if (href && document.querySelector(href)) {

    // stop scroll
    e.preventDefault();

    // scroll to element
    scrollWithOffset(href)

    // replace history item
    history.replaceState(null, null, href);

    // close offcanvas just in case
    document.getElementById('hamburger').checked = false;
  }
}

delegate.bind(document.body, 'a', 'click', onLinkClick);

if (location.hash) {
  console.log(location.hash);
  setTimeout(function() {
    scrollWithOffset(location.hash)
  }, 0);
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