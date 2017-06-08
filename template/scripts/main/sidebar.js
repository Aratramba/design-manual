'use strict';
/* global require */

var dispatcher = require('./dispatcher');
var constants = require('../constants');

var $navLinks = document.querySelectorAll('.js-sidebar__item');


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