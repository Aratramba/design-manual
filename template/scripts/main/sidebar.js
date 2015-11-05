'use strict';
/* global require */

var Mustache = require('mustache');

var TEMPLATE = document.getElementById('sidebar-link-template').innerHTML;
Mustache.parse(TEMPLATE);


/**
 * Renders the in page sidebar navigation
 */

function Sidebar($el){

  function init(){
    var headings = aggregate();
    render(headings);
  }


  /**
   * Find all page sections by H2
   */

  function aggregate(){
    var items = {};
    var els = document.querySelectorAll('.content h2');
    var i = 0;
    var l = els.length;
    var id;
    for(; i<l; ++i){
      id = els[i].id;
      if(id){
        items[els[i].id] = {
          label: els[i].textContent,
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
    $el.innerHTML = html;
  }

  if($el){
    init();
  }
}

var $sidebar = document.querySelector('.js-sidebar');
new Sidebar($sidebar);
