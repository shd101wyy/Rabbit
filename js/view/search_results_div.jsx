import React from 'react'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

import Feed from './feed.jsx'
import DisSource from './dis_source.jsx'

import homeAPI from '../api/home_api.js'
import utility from '../utility.js'

class SearchResultsDiv extends React.Component {
  render() {
    const {diss, feeds} = this.props.searchResults
    return <div className="feed-div">
      {(diss || []).map((d) => <DisSource dis={d}/>)}
      {(feeds || []).map((feed)=> <Feed dis={feed.dis} feed={feed}></Feed>)}
    </div>
  }
}

SearchResultsDiv.propTypes = {
  searchResults: React.PropTypes.object.isRequired,
  // refreshSubscriptions: React.PropTypes.func.isRequired
}

export default SearchResultsDiv