import React from 'react'

import SearchResultsDiv from './search_results_div.jsx'
import TrendingDiv from './trending_div.jsx'
import TopSubscriptionsDiv from './top_subscriptions_div.jsx'
import homeAPI from '../api/home_api.js'

class SearchPage extends React.Component {
  constructor() {
    super()

    this.state = {
      searchboxValue: '',
      status: null,
      showSearchResults: false,
      searchResults: null,
      selected: 0,  // nav-btn
      searchType: 'general'
    }

    this.handleSearchboxChange = this.handleSearchboxChange.bind(this)
    this.handleSearchboxKeydown = this.handleSearchboxKeydown.bind(this)
  }

  handleSearchboxChange(e) {
    if (!e.target.value) {
      return this.setState({searchboxValue: '', searchResults: null, showSearchResults: false, searchType: 'general'})
    }
    const value = e.target.value.trim()
    let searchType = 'general'
    if (value[0] === '#')
      searchType = 'topic'
    this.setState({searchboxValue: e.target.value, searchType})
  }

  handleSearchboxKeydown(e) {
    if (e.which === 13) {
      let searchText = this.state.searchboxValue
      this.setState({status: 'Searching...', showSearchResults: false}, ()=> {
        homeAPI.search(searchText, (data)=> {
          if (data.success && data.data) {
            this.setState({status: '', showSearchResults: true, searchResults: data.data})
          } else {
            this.setState({status: 'No results found :(', showSearchResults: false})
          }
        })
      })
    }
  }

  render() {
    return <div className="page search-page">
      <div className="header">
        <div className="search-status">{this.state.searchType}</div>
        <input className="search-box" type="text" placeholder="Search & Add source" value={this.state.searchboxValue} onChange={this.handleSearchboxChange} onKeyDown={this.handleSearchboxKeydown}/>
      </div>
      <div className="container">
      {/* TODO: 分成三栏： source | feed | tag */}
      {
        this.state.showSearchResults ?
        <SearchResultsDiv searchResults={this.state.searchResults}></SearchResultsDiv> :
        <div className="trending-section">
          <div className="nav-button-group">
            <div className={"nav-btn column-1-3 " + (this.state.selected === 0 ? 'selected' : '')}
                 onClick={()=> this.setState({selected: 0})}> Trending </div>
            <div className={"nav-btn column-1-3 " + (this.state.selected === 1 ? 'selected' : '')}
                 onClick={()=> this.setState({selected: 1})}> Top Feeds </div>
            <div className={"nav-btn column-1-3 " + (this.state.selected === 2 ? 'selected' : '')}
                 onClick={()=> this.setState({selected: 2})}> Top Subscriptions </div>
          </div>
          {
            this.state.selected === 0 ? <TrendingDiv></TrendingDiv> : (
            this.state.selected === 2 ? <TopSubscriptionsDiv></TopSubscriptionsDiv> : null
            )
          }
        </div>
      }
        {this.state.status
          ? <div className="status">
              {this.state.status}
            </div>
          : null
        }
      </div>
    </div>
  }
}

export default SearchPage