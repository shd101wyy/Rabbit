import React from 'react'
const Autolinker = require('autolinker')

import homeAPI from '../api/home_api.js'

import utility from '../utility.js'

let MSNRY = null

class Feed extends React.Component {
  constructor() {
    super()
    this.state = {
      articleSummary: {}
    }

    this.showArticle = this.showArticle.bind(this)
  }

  componentDidMount() {
    let feed = this.props.feed
    if (feed.html) {
      utility.getArticleSummary(feed.html, (articleSummary) => {
        this.setState({articleSummary}, function() {
          if (MSNRY) {
            MSNRY.layout()
          }
        })
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    let feed = nextProps.feed
    if (this.props.feed === feed) { // same props
      return
    }
    this.setState({articleSummary: {}})
    if (feed.html) {
      utility.getArticleSummary(feed.html, (articleSummary) => {
        this.setState({articleSummary}, function() {
          if (MSNRY) {
            MSNRY.layout()
          }
        })
      })
    }
  }

  showArticle() {
    this.props.showArticle(this.props.feed)
  }

  render() {
    const feed = this.props.feed,
      summaryText = this.state.articleSummary.text,
      summaryImage = this.state.articleSummary.image,
      summaryVideo = this.state.articleSummary.video

    let mediaElement = null
    if (summaryVideo) {
      mediaElement = <div dangerouslySetInnerHTML={{
        __html: summaryVideo
      }} className="summary-video"></div>
    } else if (summaryImage) {
      /*
      mediaElement = <div style={{
        backgroundImage: `url(${summaryImage})`
      }} className="summary-image"/>
      */
      mediaElement = <img src={summaryImage} className="summary-image"/>
    }

    return <div className="feed">
      <div className="feed-header">
        <img className="author-image" src={feed.image || 'https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-48.png'}/>
        <div className="author">{feed.author || ''}</div>
        <div className="date">{utility.formatDate(feed.updated)}</div>
      </div>
      <div className="content">
        <div className="title">
          <span>{feed.title.trim()}</span>
          {feed.link
            ? <a className="glyphicon glyphicon-link feed-link" href={feed.link} target="_blank"></a>
            : null}
        </div>
        <div className="article-media">
          {mediaElement}
        </div>
        <div className="article-summary">{summaryText || ''}</div>
        <div className="message" dangerouslySetInnerHTML={{__html: utility.convertMessage(feed.text)}}></div>
        <div className="show-article">
          <a onClick={this.showArticle}>See Article</a>
        </div>
      </div>
    </div>
  }
}

// https://facebook.github.io/react/docs/reusable-components.html
Feed.propTypes = {
  feed: React.PropTypes.object.isRequired,
  showArticle: React.PropTypes.func.isRequired,
}

class FeedDiv extends React.Component {
  constructor() {
    super()
    this.state = {
      loadingFeeds: false,
      noMoreFeeds: false,
      status: '',
      dis: null
    }
    this.showArticle = this.showArticle.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.getMoreFeeds = this.getMoreFeeds.bind(this)
  }

  componentDidMount() {
    const elem = document.querySelector('.feed-div')
    this.elem = elem
    elem.addEventListener('scroll', this.handleScroll)
    this.getMoreFeeds()
  }

  componentWillUnmount() {
    this.elem.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate() {
  }

  showArticle(feed) {
    this.props.showArticle(feed)
  }

  handleScroll() {
    if (this.state.loadingFeeds || this.state.noMoreFeeds || !this.elem)
      return
    let scrollBottom = this.elem.scrollTop + this.elem.offsetHeight,
      scrollHeight = this.elem.scrollHeight

    if (Math.abs(scrollBottom - scrollHeight) <= 100) {
      this.getMoreFeeds()
    }
  }

  getMoreFeeds() {
    const {source} = this.props

    const oldFeeds = (this.state.dis ? this.state.dis.feeds : []) || []
    const feedsCount = oldFeeds.length || 0,
        feedsPerPage = 10,
        page = Math.floor(feedsCount / feedsPerPage)

    this.setState({
      loadingFeeds: true,
      status: 'loading feeds...'
    }, () => {
      homeAPI.getFeeds({
        source,
        page: page,
        count: feedsPerPage
      }, (data) => {
        let dis = data.data
        if (!dis.feeds.length) { // no more feeds
          return this.setState({
            loadingFeeds: false,
            noMoreFeeds: true,
            status: 'no more feeds :('
          })
        }
        dis.updated = new Date(dis.updated)
        dis.feeds.forEach((d) => { // convert updated to Date
          d.updated = new Date(d.updated)
        })

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
          loadingFeeds: false,
          noMoreFeeds: false,
          status: '',
          dis: dis
        })
      })
    })
  }

  render() {
    let dis = this.state.dis
    if (!dis || !dis.feeds || !dis.feeds.length) {
      return <div className="feed-div">
        <div className="status">
          No feeds :(
        </div>
      </div>
    }

    let status = this.props.status

    let feeds = dis.feeds
    return <div className="feed-div masonry">
      {feeds.map((feed, offset) => {
        return <Feed feed={feed} showArticle={this.props.showArticle}></Feed>
      })}
      <div className="status">
        {status}
      </div>
    </div>
  }
}

FeedDiv.propTypes = {
  source: React.PropTypes.string.isRequired,
}

export default FeedDiv