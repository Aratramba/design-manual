'use strict';
/* globals module, require */

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

/**
 * Dispatcher
 * The only task of the dispatcher is to notify 
 * all handlers which actions have taken place.
 * Dispatcher should never have to handle any values directly,
 * it just passes them along.
 */

var Dispatcher = assign({}, EventEmitter.prototype, {
  handleViewAction: function(action){
    this.emit(action.type, action);
  }
});

module.exports = Dispatcher;