'use strict';
/* global require */

window.App = {};

require('./libs/srcdoc-polyfill.min');
require('./libs/prism');
require('./libs/smoothscroll');
require('./main/sidebar');
require('./main/offcanvas');
require('./main/states');
require('./components/index');

var iframeResizer = require('./libs/iframeResizer.min');
iframeResizer({ checkOrigin: false });