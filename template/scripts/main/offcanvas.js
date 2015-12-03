'use strict';

var toggle = document.querySelectorAll('.js-toggle');

function toggleClass(e){
  var sibling =  e.target.parentNode.nextElementSibling;
  sibling.classList.toggle('is-open');
}


var i = 0;
var l = toggle.length;

for(; i<l; i++){
  toggle[i].addEventListener('click', toggleClass);
}
