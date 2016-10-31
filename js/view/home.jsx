import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

// import TopBar from './topbar.jsx'
// import FeedDiv from './feed_div.jsx'
// import SearchResultsDiv from './search_results_div.jsx'
import NavDiv from './nav_div.jsx'
// import FeedDialog from './feed_dialog.jsx'
// import ArticlePanel from './article_panel.jsx'
import SearchPage from './search_page.jsx'
import FeedPage from './feed_page.jsx'
import SubscriptionsPage from './subscriptions_page.jsx'

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
      page: 'SEARCH_PAGE' // SEARCH_PAGE | FEED_PAGE | NOTIFICATION_PAGE | SUBSCRIPTIONS_PAGE
    }

    this.showSearchResults = this.showSearchResults.bind(this)
    this.hideSearchResults = this.hideSearchResults.bind(this)
    this.hideFeedDialog = this.hideFeedDialog.bind(this)
    this.composeNewFeed = this.composeNewFeed.bind(this)
    this.postFeed = this.postFeed.bind(this)
    this.showArticle = this.showArticle.bind(this)
    this.hideArticle = this.hideArticle.bind(this)
    this.setPage = this.setPage.bind(this)
  }

  componentDidMount() {
    /*
    homeAPI.getHomePageData((data) => {
      console.log(data)
      if (data.success) {
        let subscriptions = data.data
        subscriptions = [
          {
            source: 'localhost',
            image: null,
            title: 'all feeds'
          }
        ].concat(subscriptions)
        this.setState({
          subscriptions
        })
      }
    })
    */
  }

  componentWillUnmount() {
  }

  setPage(page) {
    this.setState({page})
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

    let page = null
    switch (this.state.page) {
      case 'SEARCH_PAGE':
        page = <SearchPage></SearchPage>
        break
      case 'FEED_PAGE':
        page = <FeedPage source={"localhost"}></FeedPage>
        break
      case 'SUBSCRIPTIONS_PAGE':
        page = <SubscriptionsPage></SubscriptionsPage>
      default:
        break
    }

    return <div className={className} ref="home-dom">
      {/* <TopBar showSearchResults={this.showSearchResults} hideSearchResults={this.hideSearchResults} composeNewFeed={this.composeNewFeed}></TopBar> */}
      <NavDiv page={this.state.page} setPage={this.setPage}></NavDiv>
      {page}
      {/*
      {this.state.showSearchResults
        ? <SearchResultsDiv searchResults={this.state.searchResults} refreshSubscriptions={this.refreshSubscriptions}></SearchResultsDiv>
        : <FeedDiv dis={this.state.dis} showArticle={this.showArticle} status={this.state.loadingFeeds
          ? 'loading feeds...'
          : (this.state.noMoreFeeds
            ? 'no more feeds :)'
            : '')}></FeedDiv>}
      {this.state.showFeedDialog
        ? <FeedDialog postFeed={this.postFeed} hideFeedDialog={this.hideFeedDialog}></FeedDialog>
        : null}
      {this.state.showArticlePanel
        ? <ArticlePanel feed={this.state.feed} hideArticle={this.hideArticle}></ArticlePanel>
        : null}
        */}
    </div>
  }
}

export default Home