import React from 'react'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

class NavDiv extends React.Component {
  constructor() {
    super()
    this.state = {
      page: 'NOTIFICATIONS_PAGE'
    }
  }

  componentDidMount() {
    // browserHistory.push('/rabbit/search_page')
    browserHistory.push('/rabbit/notifications_page')

    window.browserHistory = browserHistory
  }

  clickSection(name) {
    console.log('click section')
    browserHistory.push('/rabbit/' + name.toLowerCase())
    ipcRenderer.send('clear-history')
    this.setState({page: name})
  }

  render() {
    // let subscriptions = this.props.subscriptions,
    // currentlyViewingDIS = this.props.currentlyViewingDIS
    const {page} = this.state

    return <div className="nav-div">
      <img className="profile-pic" src="https://avatars3.githubusercontent.com/u/1908863?v=3&s=466" />
      <div className={"section" + (page === 'NOTIFICATIONS_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'NOTIFICATIONS_PAGE')}>
        <i className="icon fa fa-rss" aria-hidden="true"></i>
      </div>
      {/*
      <div className={"section" + (page === 'HOME_FEED_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'HOME_FEED_PAGE')}>
        <i className="icon fa fa-rss" aria-hidden="true"></i>
      </div>
      */}
      <div className={"section" + (page === 'SEARCH_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'SEARCH_PAGE')}>
        <i className="icon fa fa-search" aria-hidden="true"></i>
      </div>
      {/*
      <div className={"section" + (page === 'SUBSCRIPTIONS_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'SUBSCRIPTIONS_PAGE')}>
        <i className="icon fa fa-address-book" aria-hidden="true"></i>
      </div>
      <div className={"section" + (page === 'TOPIC_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'TOPIC_PAGE')}>
        <i className="icon fa fa-hashtag" aria-hidden="true"></i>
      </div>
      */}
    </div>
  }
}

NavDiv.propTypes = {
}

export default NavDiv