import React from 'react'
import {browserHistory} from 'react-router'

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
    this.showDISPage = this.showDISPage.bind(this)
  }

  componentDidMount() {
    let feed = this.props.feed
    if (feed.type === 'article') {
      if (!feed.content.html) feed.content.html = utility.renderMarkdown(feed.content.markdown)
      utility.getArticleSummary(feed.content.html, (articleSummary) => {
        this.setState({articleSummary})
      })
    }

    const text = this.refs.text
    if (text) {
      utility.formatHTMLElement(text)
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

  componentDidUpdate() {
    const text = this.refs.text
    if (text) {
      utility.formatHTMLElement(text)
    }
  }

  showArticle() {
    // TODO: to be implemented
    const {_id} = this.props.feed
    ipcRenderer.send('show-feed-page', _id)
  }

  showVideo(src) {
    ipcRenderer.send('show-video-window', src)
  }

  openURL(url) {
    ipcRenderer.send('open-url', url)
  }

  showDISPage() {
    const {source} = this.props.dis
    ipcRenderer.send('show-dis-page', source)
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
        mediaElement = <div style={{backgroundImage: `url(${summaryImage})`}} className="summary-image"/>
      }

      return <div className="feed">
        <div className="feed-sidebar">
          <img className="author-image" src={disImage} onClick={this.showDISPage}/>
        </div>
        <div className="feed-container">
          <div className="feed-header">
            <div className="author" onClick={this.showDISPage}>{disTitle}</div>
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
      </div>
    } else if (feed.type === 'text') { // TODO: support text
      return <div className="feed">
        <div className="feed-sidebar">
          <img className="author-image" src={disImage} onClick={this.showDISPage}/>
        </div>
        <div className="feed-container">
          <div className="feed-header">
            <div className="author" onClick={this.showDISPage}>{disTitle}</div>
            <div className="date">{utility.formatDate(feed.updated)}</div>
          </div>
          <div className="content">
            <div className="text" ref="text">
              <span dangerouslySetInnerHTML={{__html: utility.convertMessage(feed.content.text || '')}}></span>
            </div>
          </div>
        </div>
      </div>
    }
  }
}

// https://facebook.github.io/react/docs/reusable-components.html
Feed.propTypes = {
  feed: React.PropTypes.object.isRequired,
  dis: React.PropTypes.object.isRequired
}

export default Feed