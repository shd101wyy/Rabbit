import React from 'react'

import SearchResultsDiv from './search_results_div.jsx'
import homeAPI from '../api/home_api.js'

class SearchPage extends React.Component {
  constructor() {
    super()

    this.state = {
      searchboxValue: '',
      status: null,
      showSearchResults: false,
      searchResults: null
    }

    this.handleSearchboxChange = this.handleSearchboxChange.bind(this)
    this.handleSearchboxKeydown = this.handleSearchboxKeydown.bind(this)
  }

  handleSearchboxChange(e) {
    if (!e.target.value) {
      return this.setState({searchboxValue: '', searchResults: null, showSearchResults: false})
    }
    this.setState({searchboxValue: e.target.value})
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
        <input className="search-box" type="text" placeholder="Search & Add source" value={this.state.searchboxValue} onChange={this.handleSearchboxChange} onKeyDown={this.handleSearchboxKeydown}/>
      </div>
      <div className="container">
      {/* TODO: 分成三栏： source | feed | tag */}
      {
        this.state.showSearchResults ?
        <SearchResultsDiv searchResults={this.state.searchResults}></SearchResultsDiv> : null
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