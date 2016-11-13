// store notifications
const {ipcRenderer} = require('electron')

import homeAPI from '../api/home_api.js'

const socket = io(IP)
socket.on('connect', function() {
  console.log('connect')
})

socket.on('feed-notification', function(feed) {
  /**
  ipcRenderer.send('feed-notification', feed)
  */
  const notification = new Notification(feed.title, {
    body: feed.content.text,
    icon: feed.image || 'rabbit://images/rss-icon.png'
  })
  if (feed.link) {
    notification.onclick = function() {
      ipcRenderer.send('open-url', feed.link)
    }
  }

  notificationsStore.notifications.forEach((n)=> {
    if (n.source === source) {
      n.unreadCount += 1
      return
    }
  })
  notificationsStore.updateComponent()
})

socket.on('marked-all-feeds-as-read', function({source, userId}) {
  console.log('marked all feeds as read')
  notificationsStore.notifications.forEach((n)=> {
    if (n.source === source) {
      n.unreadCount = 0
      return
    }
  })
  notificationsStore.updateComponent()
})

const notificationsStore = {
  notifications: [],
  component: null,
  init() {
    this.updateStore(()=> {
      socket.emit('connect-user', userId)
    })
  },

  updateStore(callback) {
    homeAPI.getNotificationsData((data)=> {
      if (data.success) {
        let {notifications} = data.data
        notifications.forEach((n)=> n.updated = new Date(n.updated))
        notifications.sort((a, b)=> b.updated - a.updated)
        this.notifications = notifications

        this.updateComponent()
        if (callback) callback()
      }
    })
  },

  updateComponent() {
    if (!this.component) return
    this.component.setState({notifications: this.notifications})
  },

  bindComponent(component) {
    this.component = component
    this.updateComponent()
  },

  removeSource(source) {
    this.notifications = this.notifications.filter((n)=> n.source !== source)
    this.updateComponent()

  },

  markAllFeedsAsRead(source) {
    socket.emit('mark-all-feeds-as-read', {source, userId})
  }
}

export default notificationsStore