'use strict';
/* global require */

window.App = {};

require('./libs/srcdoc-polyfill.min');
require('./libs/prism');
require('./libs/smoothscroll');
require('./components/index');
require('./main/offcanvas');
require('./main/sidebar');
require('./main/breadcrumb');
require('./main/section');

var iframeResizer = require('./libs/iframeResizer.min');
iframeResizer({ checkOrigin: false });