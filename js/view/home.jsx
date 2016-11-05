import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

// import TopBar from './topbar.jsx'
// import FeedDiv from './feed_div.jsx'
// import SearchResultsDiv from './search_results_div.jsx'
import NavDiv from './nav_div.jsx'
import DISPage from './dis_page.jsx'
import FeedPage from './feed_page.jsx'
import TopicPage from './topic_page.jsx'

import homeAPI from '../api/home_api.js'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      showFeedDialog: false,
      history: []
    }

    this.hideFeedDialog = this.hideFeedDialog.bind(this)
    this.composeNewFeed = this.composeNewFeed.bind(this)
    this.postFeed = this.postFeed.bind(this)
  }

  componentDidMount() {
    ipcRenderer.on('show-topic-page', (event, tag)=> {
      const topicPage =  <TopicPage tag={tag}></TopicPage>
      const {history} = this.state
      history.push(topicPage)
      this.setState({history})
    })

    ipcRenderer.on('show-dis-page', (event, source)=> {
      const disPage =  <DISPage source={source}></DISPage>
      const {history} = this.state
      history.push(disPage)
      this.setState({history})
    })

    ipcRenderer.on('show-feed-page', (event, _id)=> {
      const feedPage =  <FeedPage feedObjectId={_id}></FeedPage>
      const {history} = this.state
      history.push(feedPage)
      this.setState({history})
    })

    ipcRenderer.on('history-go-back', (event, data)=> {
      const {history} = this.state
      history.pop()
      this.setState({history})
    })
  }

  componentWillUnmount() {
  }

  hideFeedDialog() {
    if (this.state.showFeedDialog) {
      this.setState({showFeedDialog: false})
    }
  }

  composeNewFeed() {
    if (!this.state.showFeedDialog) {
      this.setState({showFeedDialog: true})
    }
  }

  postFeed(value) {
    // console.log('feed: ' + value)
    if (!value || !value.length)
      return
    homeAPI.postFeed({
      text: value
    }, (data) => {
      if (data.success) {
        this.setState({showFeedDialog: false})
      }
    })
  }

  render() {
    const {history} = this.state
    return <div className="home">
      <NavDiv></NavDiv>
      {this.props.children}
      {history}
    </div>
  }
}

export default Home