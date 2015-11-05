'use strict';
/* global module */

module.exports = function($el, node_type){
  var $prev = $el.previousElementSibling;
  while($prev){
    $prev = $prev.previousElementSibling;
    if($prev.nodeName === node_type.toUpperCase()){
      return $prev;
    }
  }
  return null;
};