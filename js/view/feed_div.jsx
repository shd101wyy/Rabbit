import React from 'react'
const Autolinker = require('autolinker')

import Feed from './feed.jsx'

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

class FeedDiv extends React.Component {
  constructor() {
    super()
    this.state = {
      loadingFeeds: false,
      noMoreFeeds: false,
      status: '',
      dis: null
    }
    this.handleScroll = this.handleScroll.bind(this)
    this.getMoreFeeds = this.getMoreFeeds.bind(this)
  }

  componentDidMount() {
    const elem = document.querySelector('.feed-div')
    this.elem = elem
    elem.addEventListener('scroll', this.handleScroll)
    this.getMoreFeeds()
  }

  componentWillUnmount() {
    this.elem.removeEventListener('scroll', this.handleScroll)
  }

  componentDidUpdate() {
  }

  handleScroll() {
    if (this.state.loadingFeeds || this.state.noMoreFeeds || !this.elem)
      return
    let scrollBottom = this.elem.scrollTop + this.elem.offsetHeight,
      scrollHeight = this.elem.scrollHeight

    if (Math.abs(scrollBottom - scrollHeight) <= 100) {
      this.getMoreFeeds()
    }
  }

  getMoreFeeds() {
    this.elem.removeEventListener('scroll', this.handleScroll)
    const {source} = this.props

    const oldFeeds = (this.state.dis ? this.state.dis.feeds : []) || []
    const feedsCount = oldFeeds.length || 0,
        feedsPerPage = 10,
        page = Math.floor(feedsCount / feedsPerPage)

    this.setState({
      loadingFeeds: true,
      status: 'loading feeds...'
    }, () => {
      homeAPI.getFeeds({
        source,
        page: page,
        count: feedsPerPage
      }, (data) => {
        this.elem.addEventListener('scroll', this.handleScroll)

        let dis = data.data
        let length = dis.feeds.length
        if (!length) { // no more feeds // TODO: save page as state?
          return this.setState({
            loadingFeeds: false,
            noMoreFeeds: true,
            status: 'no more feeds :('
          })
        }
        dis.updated = new Date(dis.updated)
        dis.feeds.forEach((d) => { // convert updated to Date
          d.updated = new Date(d.updated)
        })

        let newFeeds = oldFeeds.concat(dis.feeds) // TODO: remove duplicate
        newFeeds.sort((a, b) => b.updated.getTime() - a.updated.getTime())

        for (let i = 0; i < newFeeds.length; i++) { // remove duplicate
          if (i < newFeeds.length - 1 && newFeeds[i]._id === newFeeds[i + 1]._id) {
            newFeeds.splice(i + 1, 1)
            i -= 1
          }
        }

        dis.feeds = newFeeds

        this.setState({
          loadingFeeds: false,
          noMoreFeeds: (length < feedsPerPage), // false,
          status: (length < feedsPerPage ? 'no more feeds :(' : ''),
          dis: dis
        })
      })
    })
  }

  render() {
    let dis = this.state.dis
    if (!dis || !dis.feeds || !dis.feeds.length) {
      return <div className="feed-div">
        {this.props.profile}
        <div className="status">
          No feeds :(
        </div>
      </div>
    }

    const {status} = this.state,
        {feeds} = dis

    return <div className="feed-div">
      {this.props.profile}
      {feeds.map((feed, offset) => {
        if (dis.source === 'localhost') { // home feeds
          return <Feed feed={feed} dis={feed.dis}></Feed>
        }
        return <Feed feed={feed} dis={dis}></Feed>
      })}
      <div className="status">
        {status}
      </div>
    </div>
  }
}

FeedDiv.propTypes = {
  source: React.PropTypes.string.isRequired,
}

export default FeedDiv