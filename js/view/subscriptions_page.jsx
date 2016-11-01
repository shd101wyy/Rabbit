import React from 'react'
const path = require('path')
const {app} = require('electron').remote

import homeAPI from '../api/home_api.js'

class SubscriptionsPage extends React.Component {
  constructor() {
    super()
    this.state = {
      subscriptions: []
    }
    this.refreshSubscriptions = this.refreshSubscriptions.bind(this)
  }

  componentDidMount() {
    this.refreshSubscriptions()
  }

  refreshSubscriptions() {
    homeAPI.getSubscriptions((data) => {
      console.log('get subscriptions: ', data)
      if (data.success) {
        let subscriptions = data.data
        subscriptions = subscriptions.sort((a, b) => a.title.localeCompare(b.title))
        this.setState({subscriptions})
      }
    })
  }

  clickSubscription(source) {
    console.log('source: ' + source)
  }

  render() {
    const {subscriptions} = this.state
    return <div className="page subscriptions-page">
      <div className="header">
        <div className="column-1-1">
          Subscriptions
        </div>
      </div>
      <div className="subscriptions-list">
        {subscriptions.map((subscription)=> {
          const {title, source} = subscription
          let image = subscription.image || 'rabbit:///images/rss-icon.png'
          return <div className="subscription-item" onClick={this.clickSubscription.bind(this, source)}>
            <img className="image" src={image} />
            <div className="name">{title}</div>
          </div>
        })}
      </div>
    </div>
  }
}

SubscriptionsPage.propTypes = {
}

export default SubscriptionsPage