import React from 'react'
import {browserHistory} from 'react-router'

class NavDiv extends React.Component {
  constructor() {
    super()
  }

  clickDIS(source) {
    this.props.retrieveDISFeeds(source)
  }

  render() {
    // let subscriptions = this.props.subscriptions,
    // currentlyViewingDIS = this.props.currentlyViewingDIS

    return <div className="nav-div">
      {/*<div className="search-box-div">
        <input className="search-box" type="text" placeholder="search & add source" />
      </div>*/}
      <img className="profile-pic" src="https://avatars3.githubusercontent.com/u/1908863?v=3&s=466" />

      <div className="section">
        <i className="icon fa fa-search" aria-hidden="true"></i>
      </div>
      <div className="section">
        <i className="icon fa fa-bell" aria-hidden="true"></i>
      </div>
      <div className="section">
        <i className="icon fa fa-rss" aria-hidden="true"></i>
      </div>
    </div>
  }
}

NavDiv.propTypes = {
  // subscriptions: React.PropTypes.array.isRequired,
  // currentlyViewingDIS: React.PropTypes.object.isRequired,
  // retrieveDISFeeds: React.PropTypes.func.isRequired
}

export default NavDiv