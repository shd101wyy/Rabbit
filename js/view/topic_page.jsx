import React from 'react'
import {browserHistory} from 'react-router'

import FeedDiv from './feed_div.jsx'

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

class TopicPage extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    // const tag = decodeURIComponent(this.props.params.tag)
    return <div className="page topic-page">
      <i className="back-btn fa fa-chevron-left" aria-hidden="true" onClick={utility.historyGoBack}></i>
      <div className="header">
        <div className="column-1-1">
          {'#' + this.props.tag}
        </div>
      </div>
      <FeedDiv topic={this.props.tag}></FeedDiv>
    </div>
  }
}

TopicPage.PropTypes = {
  tag: React.PropTypes.string.isRequired,
}

export default TopicPage