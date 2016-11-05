import React from 'react'
import {browserHistory} from 'react-router'

const {ipcRenderer} = require('electron')

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

class FeedPage extends React.Component {
  constructor() {
    super()
    this.state = {
      feed: null
    }
  }

  componentDidMount() {
    const feedObjectId = this.props.params.feedObjectId
    homeAPI.getFeed(feedObjectId, (data)=> {
      if (!data.success) {
        alert('Failed to load page')
        return browserHistory.goBack()
      }
      this.setState({feed: data.data})
    })
  }

  componentDidUpdate() {
    const contentElement = this.refs.content
    utility.formatHTMLElement(contentElement)
  }

  openURL(url) {
    ipcRenderer.send('open-url', url)
  }

  render() {
    if (!this.state.feed) {
      return <div className="page feed-page">
        <i className="back-btn fa fa-chevron-left" aria-hidden="true" onClick={()=> browserHistory.goBack()}></i>
        <div className="status"> loading page... </div>
      </div>
    }
    const {feed} = this.state,
          {type, updated} = feed

    let contentElement = null
    if (type === 'article') {
      const {title, link, markdown, html} = feed.content
      contentElement = <div>
        <div className="title">{title}</div>
        {markdown ?
        <div ref="content" className="content" dangerouslySetInnerHTML={{__html: utility.renderMarkdown(markdown, {unescape: true})}}></div> :
        <div ref="content" className="content" dangerouslySetInnerHTML={{__html: utility.convertHTML(html, {unescape: true})}}></div>
        }
        {link ?
        <div className="link-btn" onClick={this.openURL.bind(this, link)}> Visit website </div> : null
        }
      </div>
    } // TODO: text type

    return <div className="page feed-page">
      <i className="back-btn fa fa-chevron-left" aria-hidden="true" onClick={()=> browserHistory.goBack()}></i>
      <div className="header">
        <div className="column-1-1">
          Feed
        </div>
      </div>
      <div className="feed-page-div">
        {contentElement}
      </div>
    </div>
  }
}

export default FeedPage