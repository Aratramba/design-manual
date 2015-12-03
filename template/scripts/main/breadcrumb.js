'use strict';
/* global require */

var dispatcher = require('./dispatcher');
var constants = require('../constants');

var ACTIVE_CLASS = 'is-scrolled-in-section';

var $body = document.querySelector('body');
var $breadcrumb = document.querySelector('.js-breadcrumb');


/**
 * This changes the breadcrumb title
 * to the currently visible section
 */

function setBreadcrumb(sectionId){

  if(sectionId === null){
    $body.classList.remove(ACTIVE_CLASS);
    $breadcrumb.innerText = '';
    return;
  }

  $body.classList.add(ACTIVE_CLASS);
  $breadcrumb.innerText = document.getElementById(sectionId).innerText;
}

dispatcher.on(constants.EVENT_SECTION_INVIEW, setBreadcrumb);