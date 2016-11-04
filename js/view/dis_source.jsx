import React from 'react'
const {ipcRenderer} = require('electron')

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

class DisSource extends React.Component {
  constructor() {
    super()
    this.clickFollowBtn = this.clickFollowBtn.bind(this)
    this.clickUnfollowBtn = this.clickUnfollowBtn.bind(this)
  }

  clickFollowBtn() {
    // TODO: unfollow
    let dis = this.props.dis,
      source = dis.source

    homeAPI.follow(source, (data)=> {
      if (data.success) {
        dis.following = true
        dis.popularities = (parseInt(dis.popularities) + 1) || 1
        this.forceUpdate()
      }
    })
  }

  clickUnfollowBtn() {
    let dis = this.props.dis,
      source = dis.source

    homeAPI.unfollow(source, (data)=> {
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
      image = dis.image || 'rabbit:///images/rss-icon.png',
      description = dis.description,
      popularities = dis.popularities || 0,
      updated = new Date(dis.updated),
      following = dis.following

    return <div className="dis-source">
      <img className="dis-image" src={image}/>
      <div className="content">
        <div className="top-badge">
          <div className="title">{title}</div>
          <div className="updated">{utility.formatDate(dis.updated)}</div>
        </div>
        <div className="description">
          {description}
        </div>
        <div className="popularities">
          {'popularity: ' + popularities}
        </div>
        {following ?
          <div type="button" className="follow-btn" onClick={this.clickUnfollowBtn}>unfollow</div> :
          <div type="button" className="follow-btn" onClick={this.clickFollowBtn}>follow</div>
        }
      </div>
    </div>
  }
}
DisSource.propTypes = {
  dis: React.PropTypes.object.isRequired
}

export default DisSource