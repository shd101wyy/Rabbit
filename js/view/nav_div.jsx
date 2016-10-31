import React from 'react'

class NavDiv extends React.Component {
  constructor() {
    super()
  }

  // clickDIS(source) {
  //  this.props.retrieveDISFeeds(source)
  // }

  clickSection(name) {
    this.props.setPage(name)
  }

  render() {
    // let subscriptions = this.props.subscriptions,
    // currentlyViewingDIS = this.props.currentlyViewingDIS
    const page = this.props.page

    return <div className="nav-div">
      {/*<div className="search-box-div">
        <input className="search-box" type="text" placeholder="search & add source" />
      </div>*/}
      <img className="profile-pic" src="https://avatars3.githubusercontent.com/u/1908863?v=3&s=466" />
      <div className={"section" + (page === 'FEED_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'FEED_PAGE')}>
        <i className="icon fa fa-rss" aria-hidden="true"></i>
      </div>
      <div className={"section" + (page === 'SEARCH_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'SEARCH_PAGE')}>
        <i className="icon fa fa-search" aria-hidden="true"></i>
      </div>
      <div className={"section" + (page === 'SUBSCRIPTIONS_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'SUBSCRIPTIONS_PAGE')}>
        <i className="icon fa fa-address-book" aria-hidden="true"></i>
      </div>
      <div className={"section" + (page === 'NOTIFICATION_PAGE' ? ' selected' : '')} onClick={this.clickSection.bind(this, 'NOTIFICATION_PAGE')}>
        <i className="icon fa fa-bell" aria-hidden="true"></i>
      </div>
    </div>
  }
}

NavDiv.propTypes = {
  // subscriptions: React.PropTypes.array.isRequired,
  // currentlyViewingDIS: React.PropTypes.object.isRequired,
  // retrieveDISFeeds: React.PropTypes.func.isRequired
  page: React.PropTypes.string.isRequired,
  setPage: React.PropTypes.func.isRequired
}

export default NavDiv