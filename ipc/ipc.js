const {ipcMain} = require('electron'),
  request = require('request'),
  notifier = require('node-notifier')

const user = require('../model/user.js')

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
