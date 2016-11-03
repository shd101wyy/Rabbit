import React from 'react'

const {ipcRenderer} = require('electron')

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

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
    if (feed.type === 'article') {
      if (!feed.content.html) feed.content.html = utility.renderMarkdown(feed.content.markdown)
      utility.getArticleSummary(feed.content.html, (articleSummary) => {
        this.setState({articleSummary})
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    let feed = nextProps.feed
    if (this.props.feed === feed) { // same props
      return
    }
    this.setState({articleSummary: {}})
    if (feed.type === 'article') {
      if (!feed.content.html) feed.content.html = utility.renderMarkdown(feed.content.markdown)
      utility.getArticleSummary(feed.content.html, (articleSummary) => {
        this.setState({articleSummary})
      })
    }
  }

  showArticle() {
    // TODO: to be implemented
  }

  showVideo(src) {
    ipcRenderer.send('show-video-window', src)
  }

  openURL(url) {
    ipcRenderer.send('open-url', url)
  }

  render() {
    const dis = this.props.dis,
      feed = this.props.feed

    const disImage = dis.image || 'rabbit://images/rss-icon.png',
        disTitle = dis.title

    if (feed.type === 'article') {
      const content = feed.content,
          title = (content.title || '').trim(),
          link = (content.link || '')
      let html = (content.html) || utility.renderMarkdown(content.markdown)

      const summaryText = this.state.articleSummary.text,
        summaryImage = this.state.articleSummary.image,
        summaryVideo = this.state.articleSummary.video

      let mediaElement = null
      if (summaryVideo) {
        const videoSrc = summaryVideo.source,
              poster = summaryVideo.poster

        mediaElement = <div style={{backgroundImage: `url(${poster})`}} className="summary-video" onClick={this.showVideo.bind(this, videoSrc)}>
          <i className="fa fa-play-circle-o play-icon" aria-hidden="true"></i>
        </div>
      } else if (summaryImage) {
        mediaElement = <img src={summaryImage} className="summary-image"/>
      }

      return <div className="feed">
        <div className="feed-header">
          <img className="author-image" src={disImage}/>
          <div className="author">{disTitle}</div>
          <div className="date">{utility.formatDate(feed.updated)}</div>
        </div>
        <div className="content">
          <div className="title">
            <span>{title}</span>
            {link
              ? <a className="glyphicon glyphicon-link feed-link" onClick={this.openURL.bind(this, link)}></a>
              : null}
          </div>
          <div className="article-media">
            {mediaElement}
          </div>
          <div className="article-summary">{summaryText || ''}</div>
          <div className="show-article">
            <a onClick={this.showArticle}>See Article</a>
          </div>
        </div>
      </div>
    } else if (feed.type === 'text') { // TODO: support text
      return <div> not supported </div>
    }
  }
}

// https://facebook.github.io/react/docs/reusable-components.html
Feed.propTypes = {
  feed: React.PropTypes.object.isRequired,
  dis: React.PropTypes.object.isRequired
}

export default Feed