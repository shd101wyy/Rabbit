import React from 'react'
const Autolinker = require('autolinker')

import utility from '../utility.js'

let MSNRY = null

class Feed extends React.Component {
  constructor() {
    super()
    this.state = {
      articleSummary: {}
    }

    this.convertMessage = this.convertMessage.bind(this)
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

  convertMessage(text) {
    return {
      __html: Autolinker.link(text).replace(/\n/g, '<br>')
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
        <div className="message" dangerouslySetInnerHTML={this.convertMessage(feed.text)}></div>
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
    }
    this.showArticle = this.showArticle.bind(this)
  }

  componentDidMount() {
    let elem = document.querySelector('.feed-div')
    /*
    MSNRY = new Masonry(elem, {
      // options
      itemSelector: '.feed',
      columnWidth: 12
    })
    */
  }

  componentDidUpdate() {
    /*
    let elem = document.querySelector('.feed-div')
    MSNRY = new Masonry(elem, {
      // options
      itemSelector: '.feed',
      columnWidth: 12,
      transitionDuration: '0.3s'
    })

    setTimeout(function() {
      MSNRY.layout()
    }, 200)
    */
  }

  showArticle(feed) {
    this.props.showArticle(feed)
  }

  render() {
    let dis = this.props.dis
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
  dis: React.PropTypes.object.isRequired,
  showArticle: React.PropTypes.func.isRequired,
  status: React.PropTypes.string.isRequired
}

export default FeedDiv