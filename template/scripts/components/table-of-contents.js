'use strict';
/* global module, require */

var Mustache = require('mustache');
var delegate = require('delegate-events');
var slugify = require('../libs/slugify');
var smoothScroll = require('../libs/smoothscroll');
var prev = require('../libs/previous-selector');

/**
 * Generates a table of contents 
 * based on the contents list. 
 * Simply renders a mustache template
 * with data from the original list.
 */

// parse template
var $template = document.getElementById('table-of-contents-template');
if($template){
  var TEMPLATE = $template.innerHTML;
  Mustache.parse(TEMPLATE);
}

function TOC($el){

  var id = prev($el, 'h2').id;
  var slug_prefix = '#'+ id +'-';

  // get href/label based on list item text content
  var items = Array.prototype.map.call($el.querySelectorAll('li'), function(item){
    return { 
      href: slug_prefix + slugify(item.textContent),
      label: item.textContent
    };
  });

  // append container div
  var div = document.createElement('div');
  div.className = 'table-of-contents';

  // render template
  div.innerHTML = Mustache.render(TEMPLATE, { items: items });
  $el.parentNode.insertBefore(div, $el.nextSibling);

  delegate.bind($el.parentNode, '.table-of-contents__list__item__link', 'click', onTocLinkClick);

  // append to sidebar
  // var $sidebarItem = document.querySelector('.sidebar [data-rel="' + id + '"]');
  // var $sidebarExtra = document.createElement('div');
  // $sidebarExtra.className = 'sidebar__item__components';
  // $sidebarExtra.innerHTML = div.innerHTML;
  // $sidebarItem.appendChild($sidebarExtra);

}

module.exports = TOC;

/**
 * Table of contents link click handler
 */


function onTocLinkClick(e) {
  var href = e.delegateTarget.getAttribute('href');
  var top = document.querySelector(href).getBoundingClientRect().top - 80;
  smoothScroll(top);
}