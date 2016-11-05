import React from 'react'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

import homeAPI from '../api/home_api.js'

class Tag extends React.Component {
  constructor() {
    super()
  }
  render() {
    const {name} = this.props
    return <div className="tag">{name}</div>
  }
}

Tag.propTypes = {
  name: React.PropTypes.string.isRequired,
}

class TrendingDiv extends React.Component {
  constructor() {
    super()
    this.state = {
      topics: [],
    }
  }

  clickTag(tag) {
    ipcRenderer.send('show-topic', tag)
  }

  componentDidMount() {
    homeAPI.getTrendingTopics({page: 0, count: 20}, (data)=> {
      if (data.success) {
        this.setState({topics: data.data})
      }
    })
  }

  render() {
    return <div className="trending-div">
      {this.state.topics.map((topic)=> {
        return <div className="topic" onClick={this.clickTag.bind(this, topic.name)}><Tag name={topic.name}></Tag></div>
      })}
    </div>
  }
}

export default TrendingDiv