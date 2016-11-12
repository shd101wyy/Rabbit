const {ipcMain, BrowserWindow, shell} = require('electron'),
  request = require('request'),
  notifier = require('node-notifier'),
  path = require('path'),
  {exec} = require('child_process')

const user = require('../model/user.js')


let videoWin = null
function createVideoWindow(callback) {
  videoWin = new BrowserWindow({
    width: 600,
    height: 400,
    transparent: false,
    show: false,
    // fullscreen: false
    // titleBarStyle: 'hidden'
  })

  videoWin.loadURL(`file://${path.resolve(__dirname, '../html/video.html')}`)

  videoWin.webContents.on('did-finish-load', callback)

  videoWin.on('closed', ()=> {
    videoWin = null
  })
}

function openFile(url) {
  if (process.platform === 'win32')
    cmd = 'explorer'
  else if (process.platform === 'darwin')
    cmd = 'open'
  else
    cmd = 'xdg-open'

  shell.openExternal(url)
}

module.exports = function({mainWin}) {

  ipcMain.on('check-auth', function(event, data) {
    user.getUserInfo(function(error, data) {
      if (error) {
        return event.sender.send('return-auth', {success: false})
      } else {
        return event.sender.send('return-auth', {success: true, data})
      }
    })
  })

  ipcMain.on('save-user-info', function(event, data) {
    user.saveUserInfo(data)
  })

  ipcMain.on('show-video-window', function(event, data) {
    if (!videoWin) {
      createVideoWindow(()=> {
        videoWin.show()
        videoWin.webContents.send('receive-video-request', data)
      })
    } else {
      videoWin.show()
      videoWin.webContents.send('receive-video-request', data)
    }
  })

  ipcMain.on('open-url', function(event, data) {
    if (!data) return 
    openFile(data)
  })

  ipcMain.on('show-topic-page', function(event, tag) {
    event.sender.send('show-topic-page', tag)
  })

  ipcMain.on('show-dis-page', function(event, source) {
    event.sender.send('show-dis-page', source)
  })

  ipcMain.on('show-feed-page', function(event, _id) {
    event.sender.send('show-feed-page', _id)
  })

  ipcMain.on('history-go-back', function(event, data) {
    event.sender.send('history-go-back', data)
  })

  ipcMain.on('clear-history', function(event, data) {
    event.sender.send('clear-history')
  })

}