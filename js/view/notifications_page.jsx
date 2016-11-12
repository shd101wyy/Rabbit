import React from 'react'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

const path = require('path')
const {app} = require('electron').remote

import homeAPI from '../api/home_api.js'
import notificationsStore from '../model/notifications_store.js'
import utility from '../utility.js'

class NotificationCard extends React.Component {
  constructor() {
    super()
    this.showDISPage = this.showDISPage.bind(this)
  }

  showDISPage(event) {
    event.stopPropagation()
    const {source} = this.props.notification
    ipcRenderer.send('show-dis-page', source)
  }

  render() {
    const {notification} = this.props
    const image = notification.image || 'rabbit://images/rss-icon.png',
        updated = notification.updated,
        title = notification.title,
        link = notification.link

    let text = notification.content.text
    if (text.length >= 64) {
      text = text.slice(0, 60) + '...'
    }

    return <div className="notification-card" onClick={()=> ipcRenderer.send('open-url', link)}>
        <div className="notification-sidebar">
          <img className="author-image" src={image}/>
        </div>
        <div className="notification-container">
          <div className="notification-header">
            <div className="author">{title}</div>
            <div className="date">{utility.formatDate(updated)}</div>
          </div>
          <div className="content">
            {text}
          </div>
          <div className="notification-footer">
            <i className="history-icon fa fa-clock-o" aria-hidden="true" onClick={this.showDISPage}></i>
          </div>
        </div>
      </div>
  }
}

class NotificationsPage extends React.Component {
  constructor() {
    super()
    this.state = {
      notifications: []
    }
  }

  componentDidMount() {
    notificationsStore.bindComponent(this)
  }

  render() {
    const {notifications} = this.state
    return <div className="page notifications-page">
      <div className="header">
        <div className="column-1-1">
          Home
        </div>
      </div>
      <div className="notifications-list">
      {notifications.map((n)=> <NotificationCard notification={n}></NotificationCard>)}
      </div>
    </div>
  }
}

NotificationsPage.propTypes = {
}

export default NotificationsPage