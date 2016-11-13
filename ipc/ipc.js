const {ipcMain, BrowserWindow, shell, screen} = require('electron'),
  request = require('request'),
  notifier = require('node-notifier').Growl({
    name: 'Growl Name Used', // Defaults as 'Node'
    host: 'localhost',
    port: 23053
  }),
  path = require('path'),
  {exec} = require('child_process')

const user = require('../model/user.js')

const NOTIFICATION_WINDOW_WIDTH = 350

let videoWin = null
let notificationWin = null
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

function sendNotification(data) {
  if (!notificationWin) {
    const screenSize =  screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea
    notificationWin = new BrowserWindow({
      width: NOTIFICATION_WINDOW_WIDTH,
      height: 400,
      x: Math.floor(screenSize.x + (screenSize.width - NOTIFICATION_WINDOW_WIDTH)),
      y: screenSize.y,
      show: true,

      transparent: true,
      frame: false
    })

    notificationWin.loadURL(`file://${path.resolve(__dirname, '../html/notification.html')}`)

    notificationWin.webContents.on('did-finish-load', ()=> {
      notificationWin.webContents.send('receive-notification-request', {data})
    })

    notificationWin.on('closed', ()=> {
      notificationWin = null
    })
  } else {
    if (!notificationWin.isVisible()) {
      notificationWin.show()
    }
    notificationWin.webContents.send('receive-notification-request', {data})
  }
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

  /*
  ipcMain.on('alert-pending-notifications', function(event, data) {
    if (!Object.keys(data).length) return
    let message = ''
    let i = 0
    for (let source in data) {
      if (i === 4) {
        message += '...'
        break;
      }
      const {count, title} = data[source]
      message += `${title}: ${count}.<br>`
      i += 1
    }

    setTimeout(function() {
      sendNotification({
        title: 'You have the following unread notifications',
        message: message,
        icon: path.resolve(__dirname, '../images/rss-icon.png'),
      })
    }, 2000)
  })*/

  ipcMain.on('feed-notification', function(event, feed) { // check formatNotification in server.js
    sendNotification({
      title: feed.title,
      message: feed.content.text,
      icon: feed.image || path.resolve(__dirname, '../images/rss-icon.png'),
      link: feed.link || void 0
    })
  })

  ipcMain.on('set-notification-window-height', function(event, height) {
    if (notificationWin) {
      notificationWin.setSize(NOTIFICATION_WINDOW_WIDTH, height)
      if (height <= 50) {
        notificationWin.hide()
      }
    }
  })
}