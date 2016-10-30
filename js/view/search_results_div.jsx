import React from 'react'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

// import Autolinker from 'autolinker'
const Autolinker = require('autolinker')

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

class DisSource extends React.Component {
  constructor() {
    super()
    this.convertMessage = this.convertMessage.bind(this)
    this.clickFollowBtn = this.clickFollowBtn.bind(this)
    this.clickUnfollowBtn = this.clickUnfollowBtn.bind(this)
  }

  convertMessage(text) {
    return {
      __html: Autolinker.link(text).replace(/\n/g, '<br>')
    }
  }

  clickFollowBtn() {
    // TODO: unfollow
    let dis = this.props.dis,
      source = dis.source

    ipcRenderer.send('follow-dis', {source})
    ipcRenderer.once('result-following-dis', (event, data)=> {
      if (data.success) {
        dis.following = true
        dis.popularities = parseInt(dis.popularities) + 1
        this.forceUpdate()
      }
    })
  }

  clickUnfollowBtn() {
    let dis = this.props.dis,
      source = dis.source

    ipcRenderer.send('unfollow-dis', {source})
    ipcRenderer.once('result-unfollowing-dis', (event, data)=> {
      if (data.success) {
        dis.following = false
        dis.popularities = parseInt(dis.popularities) - 1
        this.forceUpdate()
      }
    })
  }

  render() {
    let dis = this.props.dis, // this is summary
      title = dis.title,
      description = dis.description,
      popularities = dis.popularities || 0,
      feedsNum = dis.feedsNum,
      updated = new Date(dis.updated),
      following = dis.following

    return <div className="dis-source">
      <img className="dis-image" src="https://www.google.com/s2/favicons?domain=javascriptweekly.com&alt=feed"/>
      <div className="content">
        <div className="top-badge">
          <div className="title">{title}</div>
          <div className="updated">{utility.formatDate(dis.updated)}</div>
        </div>
        <div className="description">
          {description}
        </div>
        {/*
        <div className="popularities">
          {'popularity: ' + popularities}
        </div>
        // TODO: support popularity
        */}
        <div className="feedsNum">
          {'feedsNum: ' + feedsNum}
        </div>
        {following ?
          <button type="button" className="btn btn-default follow-btn" onClick={this.clickUnfollowBtn}>unfollow</button> :
          <button type="button" className="btn btn-default follow-btn" onClick={this.clickFollowBtn}>follow</button>
        }
      </div>
    </div>
  }
}
DisSource.propTypes = {
  dis: React.PropTypes.object.isRequired
}

class SearchResultsDiv extends React.Component {
  render() {
    let disSources = this.props.searchResults
    return <div className="feed-div">
      {/*<div className="section-title">
        DIS Sources</div>*/}
      {disSources.map((d) => <DisSource dis={d}/>)}
    </div>
  }
}

SearchResultsDiv.propTypes = {
  searchResults: React.PropTypes.object.isRequired,
  // refreshSubscriptions: React.PropTypes.func.isRequired
}

export default SearchResultsDiv