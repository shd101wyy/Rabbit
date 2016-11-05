import React from 'react'
import {browserHistory} from 'react-router'

import FeedDiv from './feed_div.jsx'

import homeAPI from '../api/home_api.js'

class DISPage extends React.Component {
  constructor() {
    super()
    this.state = {
      dis: null
    }
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
  }

  render() {
    const source = decodeURIComponent(this.props.params.source)
      if (!this.state.dis) {
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