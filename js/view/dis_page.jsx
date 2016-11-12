import React from 'react'
import {browserHistory} from 'react-router'

import FeedDiv from './feed_div.jsx'

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

class DISPage extends React.Component {
  constructor() {
    super()
    this.state = {
      dis: null,
      following: undefined,
      pushNotification: undefined
    }
    this.clickFollowBtn = this.clickFollowBtn.bind(this)
    this.clickUnfollowBtn = this.clickUnfollowBtn.bind(this)
    this.subscribeNotification = this.subscribeNotification.bind(this)
    this.unsubscribeNotification = this.unsubscribeNotification.bind(this)
  }

  componentDidMount() {
    const {source} = this.props

    homeAPI.getDISInfo(source, (data) => {
      if (!data.success) {
        return alert('failed to DIS info')
      }
      this.setState({dis: data.data})
    })

    homeAPI.checkFollowing(source, (data)=> {
      this.setState({following: data.data})
    })

    homeAPI.checkPushNotification(source, (data)=> {
      this.setState({pushNotification: data.data})
    })
  }

  clickFollowBtn() {
    const {source} = this.props

    homeAPI.follow(source, (data)=> {
      if (data.success) {
        this.setState({following: true, pushNotification: true})
      }
    })
  }

  clickUnfollowBtn() {
    const {source} = this.props

    homeAPI.unfollow(source, (data)=> {
      if (data.success) {
        this.setState({following: false, pushNotification: false})
      }
    })
  }

  subscribeNotification() {
    const {source} = this.props

    homeAPI.subscribeNotification(source, (data)=> {
      if (data.success) {
        this.setState({pushNotification: true})
      }
    })
  }

  unsubscribeNotification() {
    const {source} = this.props

    homeAPI.unsubscribeNotification(source, (data)=> {
      if (data.success) {
        this.setState({pushNotification: false})
      }
    })
  }

  render() {
    const {source} = this.props
      if (!this.state.dis || this.state.following === undefined || this.state.pushNotification === undefined) {
        return <div className="page dis-page">
          <div className="status">loading page...</div>
        </div>
      }

      const {dis} = this.state
        let cover = dis.cover || 'rabbit://images/default_cover_2.jpg',
          title = dis.title,
          author = dis.author,
          description = dis.description,
          image = dis.image || 'rabbit://images/rss-icon.png',
          link = dis.link,
          popularities = dis.popularities,
          tags = dis.tags,
          updated = dis.updated

        const profile = <div className="profile">
          <div className="cover" style={{
            backgroundImage: `url(${cover})`
          }}>
          </div>
          <div className="profile-container">
            <div className="author-image" style={{
              backgroundImage: `url(${image})`
            }}></div>
            {
              this.state.following ?
            <div className="follow-btn following" onClick={this.clickUnfollowBtn}></div> :
            <div className="follow-btn" onClick={this.clickFollowBtn}>follow</div>
            }
            <div className="title">{title}</div>
            <div className="description">{description}</div>
            {
              this.state.following ?
            <div className="push-notification-config">
              <div className="switch">
                <label>
                  <input type="checkbox" onClick={this.state.pushNotification ? this.unsubscribeNotification :  this.subscribeNotification} checked={this.state.pushNotification} />
                  <span className="lever"></span>
                  Notification
                </label>
              </div>
            </div> : null
            }
          </div>
        </div>

        return <div className="page dis-page">
          <i className="back-btn fa fa-chevron-left" aria-hidden="true" onClick={utility.historyGoBack}></i>
          <div className="header">
            <div className="column-1-1">
              Feed
            </div>
          </div>
          <FeedDiv source={source} profile={profile}>
          </FeedDiv>
        </div>
      }
}


DISPage.PropTypes = {
  source: React.PropTypes.string.isRequired,
}

export default DISPage