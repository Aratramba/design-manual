'use strict';
/* globals module, require */

function validate(options) {
  if (!options.components) {
    throw new Error('options.components is required');
  }

  if (!options.pages) {
    throw new Error('options.pages is required');
  }

  if (!options.output) {
    throw new Error('options.output is required');
  }

  if (!options.meta) {
    throw new Error('options.meta is required');
  }

  if (!options.meta.title) {
    throw new Error('options.meta.title is required');
  }

  if (!options.meta.domain) {
    throw new Error('options.meta.domain is required');
  }
}

module.exports = validate;