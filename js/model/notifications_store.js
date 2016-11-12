// store notifications
const {ipcRenderer} = require('electron')

import homeAPI from '../api/home_api.js'

const socket = io(IP)
socket.on('connect', function() {
  console.log('connect')
})

socket.on('feed-notification', function(feed) {
  ipcRenderer.send('feed-notification', feed)
})

socket.on('removed-pending-notifications', function({source, userId}) {
  delete notificationsStore.pendingNotifications[source]
  notificationsStore.updateComponent()
})

const notificationsStore = {
  notifications: [],
  pendingNotifications: {},
  component: null,
  init() {
    homeAPI.getNotificationsData((data)=> {
      if (data.success) {
        let {notifications, pendingNotifications} = data.data
        notifications.forEach((n)=> n.updated = new Date(n.updated))
        notifications.sort((a, b)=> b.updated - a.updated)
        this.notifications = notifications
        this.pendingNotifications = pendingNotifications

        // put title to pendingNotifications
        notifications.forEach((n)=> {
          if (!pendingNotifications[n.source]) return
          pendingNotifications[n.source] = {
            count: pendingNotifications[n.source],
            title: n.title
          }
        })

        console.log(pendingNotifications)
        ipcRenderer.send('alert-pending-notifications', pendingNotifications)
        this.updateComponent()
      }
    })
    socket.emit('connect-user', userId)
  },

  updateComponent() {
    if (!this.component) return
    this.component.setState({notifications: this.notifications, pendingNotifications: this.pendingNotifications})
  },

  bindComponent(component) {
    this.component = component
    this.updateComponent()
  },

  removePendingNotifications(source) {
    socket.emit('remove-pending-notifications', {source, userId})
  }
}

export default notificationsStore