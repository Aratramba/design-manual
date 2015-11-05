var toggle = document.querySelectorAll('.js-toggle');

var toggleClass = function(e) {
  var $el = e.target;

  var parent = $el.parentNode;
  var sibling =  parent.nextElementSibling;

  sibling.classList.toggle('is-open');
}


var i = 0;
var l = toggle.length;

for(; i<l; i++){
  toggle[i].addEventListener('click', toggleClass);
}
