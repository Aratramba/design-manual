'use strict';
/* global require */

window.App = {};

require('./main/sidebar');
require('./components/index');
require('./main/breadcrumb');
require('./main/section');
require('./main/anchors');

var Prism = require('./libs/prism');
window.Prism.highlightAll();