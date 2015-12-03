'use strict';
/* global require */

window.App = {};

require('./libs/srcdoc-polyfill.min');
require('./libs/prism');
require('./libs/smoothscroll');
require('./main/offcanvas');
require('./components/index');
require('./main/breadcrumb');
require('./main/sidebar');

var iframeResizer = require('./libs/iframeResizer.min');
iframeResizer({ checkOrigin: false });