/**
 * This gets the height of the component
 * and returns that to the main process
 */

let { app, BrowserWindow } = require('electron');

app.on('ready', function() {
  var win = new BrowserWindow({ width: 1200, height: 500, show: false });
  win.webContents.on('did-finish-load', function() {
    win.webContents.executeJavaScript('document.body.getBoundingClientRect().height', function (height) {
      process.send({
        height: height
      });
    });
  });

  process.send('electron-ready');

  process.on('message', function(data) {
    if (data) {
      if (data.exit) {
        process.exit(0);
        return;
      } else if (data.url) {
        win.loadURL(data.url);
      }
    }
  })
});