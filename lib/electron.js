/**
 * This gets the height of the component
 * and returns that to the main process
 */

let { app, BrowserWindow } = require('electron');
const {dialog} = require('electron')

app.on('ready', function() {
  var win = new BrowserWindow({ width: 1200, height: 500, show: false });
  win.webContents.once('did-finish-load', function() {
    win.webContents.executeJavaScript('document.body.offsetHeight', function (result) {
      process.send(result)
      process.exit(0);
    });
  });
  win.loadURL(process.argv[2]);
});