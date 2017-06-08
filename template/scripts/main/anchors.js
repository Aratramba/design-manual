var delegate = require('delegate-events');


/**
 * Scroll to anchor with offset
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


/**
 * Internal link click handler
 */

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
  setTimeout(function() {
    scrollWithOffset(location.hash)
  }, 0);
}