'use strict';
/* globals require */

var dispatcher = require('./dispatcher');
var constants = require('../constants');

var $sections = document.querySelectorAll('.content h2');
var $currentSection;


/**
 * on scroll, check which section is in view
 * and notify dispatcher of matching section
 */

function scroll(){
  var $prevSection = $currentSection;

  var i = 0;
  var l = $sections.length;
  var rect;
  var h = window.innerHeight;

  for(; i<l; i++){
    rect = $sections[i].getBoundingClientRect();

    if(rect.top > 0 && rect.bottom > 0 && h - rect.top > 0 && h - rect.bottom > 0){
      $currentSection = $sections[i];

      if (i === 0 && document.body.scrollTop < rect.top) {
        $currentSection = null;
      }
    }
  }

  if($prevSection !== $currentSection){
    if($currentSection){
      dispatcher.emit(constants.EVENT_SECTION_INVIEW, $currentSection.id);
      return;
    }

    dispatcher.emit(constants.EVENT_SECTION_INVIEW, null);
  }
}

window.addEventListener('scroll', scroll);
scroll();