import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

// import TopBar from './topbar.jsx'
// import FeedDiv from './feed_div.jsx'
// import SearchResultsDiv from './search_results_div.jsx'
import NavDiv from './nav_div.jsx'

import homeAPI from '../api/home_api.js'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      showSearchResults: false,
      showFeedDialog: false,
      showArticlePanel: false,
      searchResults: null,
      subscriptions: [],
      feed: null, // current viewing feed
      loadingFeeds: false,
      currentPage: 0, // 10 feeds per page
      noMoreFeeds: false,
      // page: 'SEARCH_PAGE' // SEARCH_PAGE | HOME_FEED_PAGE | NOTIFICATION_PAGE | SUBSCRIPTIONS_PAGE
    }

    this.showSearchResults = this.showSearchResults.bind(this)
    this.hideSearchResults = this.hideSearchResults.bind(this)
    this.hideFeedDialog = this.hideFeedDialog.bind(this)
    this.composeNewFeed = this.composeNewFeed.bind(this)
    this.postFeed = this.postFeed.bind(this)
    this.showArticle = this.showArticle.bind(this)
    this.hideArticle = this.hideArticle.bind(this)
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  showSearchResults(data) {
    console.log(data)
    if (data && data.success) {
      this.setState({showSearchResults: true, searchResults: data.data})
    }
  }

  hideSearchResults() {
    if (this.state.showSearchResults) {
      this.setState({showSearchResults: false})
    }
  }

  hideFeedDialog() {
    if (this.state.showFeedDialog) {
      this.setState({showFeedDialog: false})
    }
  }

  composeNewFeed() {
    if (!this.state.showFeedDialog) {
      this.setState({showFeedDialog: true})
    }
  }

  postFeed(value) {
    // console.log('feed: ' + value)
    if (!value || !value.length)
      return
    homeAPI.postFeed({
      text: value
    }, (data) => {
      if (data.success) {
        this.setState({showFeedDialog: false})
      }
    })
  }

  showArticle(feed) {
    this.setState({showArticlePanel: true, feed})
  }

  hideArticle(feed) {
    this.setState({showArticlePanel: false, feed: null})
  }

  render() {
    let className = 'home'
    if (this.state.showArticlePanel) {
      className += ' no-scroll'
    }

    return <div className={className} ref="home-dom">
      <NavDiv></NavDiv>
      {this.props.children}
    </div>
  }
}

export default Home