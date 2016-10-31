const {app, BrowserWindow, globalShortcut, ipcMain, protocol} = require('electron')
const path = require('path')

const user = require('./model/user.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 300, height: 800,
    /*, frame: false*/
    fullscreenable: false,
    // resizable: false,
    maxWidth: 800, // 600
    minWidth: 400
  })

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  globalShortcut.register('Cmd+R', () => { // TODO: relaunch app
    app.relaunch({
      args: process.argv.slice(1).concat(['--relaunch'])
    })
    app.exit(0)
  })
}

function initProtocal() {
  protocol.registerFileProtocol('rabbit', (request, callback) => {
    const url = request.url.substr(7)
    callback({
      path: path.normalize(`${__dirname}/${url}`)
    })
  }, (error) => {
    if (error)
      console.error('Failed to register protocol')
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  user.initialize(function() {
    createWindow()
    initProtocal()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// require('./electron-app/ipc.js')
require('./ipc/ipc.js')
