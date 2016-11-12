// store notifications

import homeAPI from '../api/home_api.js'

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