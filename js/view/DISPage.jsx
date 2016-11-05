import React from 'react'
import {browserHistory} from 'react-router'

import FeedDiv from './feed_div.jsx'

import homeAPI from '../api/home_api.js'

class DISPage extends React.Component {
  constructor() {
    super()
    this.state = {
      dis: null,
      following: undefined
    }
    this.clickFollowBtn = this.clickFollowBtn.bind(this)
    this.clickUnfollowBtn = this.clickUnfollowBtn.bind(this)
  }

  componentDidMount() {
    const source = decodeURIComponent(this.props.params.source)

    homeAPI.getDISInfo(source, (data) => {
      console.log(data)
      if (!data.success) {
        return alert('failed to DIS info')
      }
      this.setState({dis: data.data})
    })

    homeAPI.checkFollowing(source, (data)=> {
      console.log(data)
      this.setState({following: data.data})
    })
  }

  clickFollowBtn() {
    const source = decodeURIComponent(this.props.params.source)

    homeAPI.follow(source, (data)=> {
      if (data.success) {
        this.setState({following: true})
      }
    })
  }

  clickUnfollowBtn() {
    const source = decodeURIComponent(this.props.params.source)

    homeAPI.unfollow(source, (data)=> {
      if (data.success) {
        this.setState({following: false})
      }
    })
  }

  render() {
    const source = decodeURIComponent(this.props.params.source)
      if (!this.state.dis || this.state.following === undefined) {
        return <div className="page dis-page">
          <div className="status">loading page...</div>
        </div>
      }

      const {dis} = this.state
        let cover = dis.cover || 'rabbit://images/default_cover.jpg',
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
            <i className="back-btn fa fa-chevron-left" aria-hidden="true" onClick={()=> browserHistory.goBack()}></i>
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
          </div>
        </div>

        return <div className="page dis-page">
          <FeedDiv source={source} profile={profile}>
          </FeedDiv>
        </div>
      }
    }

    export default DISPage