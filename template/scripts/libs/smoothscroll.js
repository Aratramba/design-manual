'use strict';
/* global module */

module.exports = function(y) {
  var pos = window.pageYOffset;
  y += pos;

  function doScroll(){
    pos += (y - pos) / 10;
    window.scroll(0, pos);
    if (Math.round(pos) !== y) {
      requestAnimationFrame(doScroll);
    }
  }
  requestAnimationFrame(doScroll);
};