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

import homeAPI from '../api/home_api.js'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      showSearchResults: false,
      showFeedDialog: false,
      showArticlePanel: false,
      searchResults: null,
      dis: {},
      subscriptions: [],
      feed: null, // current viewing feed
      loadingFeeds: false,
      currentPage: 0, // 10 feeds per page
      noMoreFeeds: false,
      page: 'SEARCH_PAGE'
    }

    this.showSearchResults = this.showSearchResults.bind(this)
    this.retrieveDISFeeds = this.retrieveDISFeeds.bind(this)
    this.hideSearchResults = this.hideSearchResults.bind(this)
    this.hideFeedDialog = this.hideFeedDialog.bind(this)
    this.refreshSubscriptions = this.refreshSubscriptions.bind(this)
    this.composeNewFeed = this.composeNewFeed.bind(this)
    this.postFeed = this.postFeed.bind(this)
    this.showArticle = this.showArticle.bind(this)
    this.hideArticle = this.hideArticle.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.getMoreFeeds = this.getMoreFeeds.bind(this)
  }

  componentDidMount() {
    /*
    homeAPI.getHomePageData((data) => {
      // console.log(data)
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
        }, () => {
          this.retrieveDISFeeds('localhost')
        })
      }
    })

    this.homeDOM = ReactDOM.findDOMNode(this.refs['home-dom'])
    this.homeDOM.addEventListener('scroll', this.handleScroll)
    */
    /*
    ipcRenderer.send('get-subscriptions')
    ipcRenderer.on('receive-subscriptions', (event, data)=> {
      const {subscriptions} = data
    })
    */
    this.homeDOM = ReactDOM.findDOMNode(this.refs['home-dom'])
  }

  componentWillUnmount() {
    this.homeDOM.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(event) {
    if (this.state.loadingFeeds || this.state.noMoreFeeds || this.state.showSearchResults)
      return
    let scrollBottom = this.homeDOM.scrollTop + this.homeDOM.offsetHeight,
      scrollHeight = this.homeDOM.scrollHeight

    if (Math.abs(scrollBottom - scrollHeight) <= 100) {
      console.log('load more feeds')
      this.getMoreFeeds()
    }
  }

  refreshSubscriptions() {
    homeAPI.getSubscriptions((data) => {
      console.log('get subscriptions: ', data)
      if (data.success) {
        let subscriptions = data.data
        subscriptions = [
          {
            source: 'localhost',
            image: null,
            title: 'all feeds'
          }
        ].concat(subscriptions)
        this.setState({subscriptions})
      }
    })
  }

  showSearchResults(data) {
    console.log(data)
    if (data && data.success) {
      this.setState({showSearchResults: true, searchResults: data.data})
    }
  }

  retrieveDISFeeds(source, opt = {}) { // first time retrieve DIS feeds
    this.setState({
      loadingFeeds: true,
      noMoreFeeds: false
    }, () => {
      const page = opt.page || 0,
        count = opt.count || 10

      homeAPI.getFeeds({
        source,
        page,
        count
      }, (data) => {
        // console.log(data)
        if (data.success) {
          let dis = data.data
          dis.updated = new Date(dis.updated)
          dis.feeds.forEach((d) => { // convert updated to Date
            d.updated = new Date(d.updated)
          })
          dis.feeds.sort((a, b) => b.updated.getTime() - a.updated.getTime()) // sort feeds by Date
          this.setState({
            showSearchResults: false,
            dis,
            loadingFeeds: false,
            currentPage: 0
          }, () => {
            this.handleScroll()
          })
        }
      })
    })
  }

  getMoreFeeds() {
    let source = this.state.dis.source,
      currentPage = this.state.currentPage

    this.setState({
      loadingFeeds: true
    }, () => {
      homeAPI.getFeeds({
        source,
        page: currentPage + 1,
        count: 10
      }, (data) => {
        let dis = data.data
        if (!dis.feeds.length) { // no more feeds
          return this.setState({
            showSearchResults: false,
            loadingFeeds: false,
            currentPage: currentPage + 1,
            noMoreFeeds: true
          })
        }
        dis.updated = new Date(dis.updated)
        dis.feeds.forEach((d) => { // convert updated to Date
          d.updated = new Date(d.updated)
        })

        let oldFeeds = this.state.dis.feeds || []
        let newFeeds = oldFeeds.concat(dis.feeds) // TODO: remove duplicate
        newFeeds.sort((a, b) => b.updated.getTime() - a.updated.getTime())

        for (let i = 0; i < newFeeds.length; i++) { // remove duplicate
          if (i < newFeeds.length - 1 && newFeeds[i].id === newFeeds[i + 1].id) {
            newFeeds.splice(i + 1, 1)
            i -= 1
          }
        }

        dis.feeds = newFeeds

        this.setState({
          showSearchResults: false,
          dis,
          loadingFeeds: false,
          currentPage: currentPage + 1,
          noMoreFeeds: false
        })
      })
    })
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
      default:
        break
    }

    return <div className={className} ref="home-dom">
      {/* <TopBar showSearchResults={this.showSearchResults} hideSearchResults={this.hideSearchResults} composeNewFeed={this.composeNewFeed}></TopBar> */}
      <NavDiv subscriptions={this.state.subscriptions} currentlyViewingDIS={this.state.dis} retrieveDISFeeds={this.retrieveDISFeeds}></NavDiv>
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