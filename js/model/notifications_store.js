// store notifications

import homeAPI from '../api/home_api.js'

const socket = io(IP)
socket.on('connect', function() {
  console.log('connect')
})

socket.on('feed-notification', function(feed) {
  console.log('receive-feed-notification', feed)
})

const notificationsStore = {
  notifications: [],
  component: null,
  init() {
    homeAPI.getNotificationsData((data)=> {
      if (data.success) {
        let notifications = data.data
        notifications.forEach((n)=> n.updated = new Date(n.updated))
        notifications.sort((a, b)=> b.updated - a.updated)
        this.notifications = notifications
        this.updateComponent()
      }
    })
    socket.emit('connect-user', userId)
  },

  updateComponent() {
    if (!this.component) return
    this.component.setState({notifications: this.notifications})
  },

  bindComponent(component) {
    this.component = component
    this.updateComponent()
  }

}

export default notificationsStore