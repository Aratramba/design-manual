function validate(options) {
  if (!options.components) {
    console.log('Design Manual error: options.components is required');
    process.exitCode = 1;
  }

  if (!options.pages) {
    console.log('Design Manual error: options.pages is required');
    process.exitCode = 1;
  }

  if (!options.output) {
    console.log('Design Manual error: options.output is required');
    process.exitCode = 1;
  }

  if (!options.meta) {
    console.log('Design Manual error: options.meta is required');
    process.exitCode = 1;
  }

  if (!options.meta.title) {
    console.log('Design Manual error: options.meta.title is required');
    process.exitCode = 1;
  }

  if (!options.meta.domain) {
    console.log('Design Manual error: options.meta.domain is required');
    process.exitCode = 1;
  }
}

module.exports = validate;