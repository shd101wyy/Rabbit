import React from 'react'

import FeedDiv from './feed_div.jsx'

class FeedPage extends React.Component {
  constructor() {
    super()
  }

  clickDIS(source) {
    this.props.retrieveDISFeeds(source)
  }

  render() {
    let subscriptions = this.props.subscriptions,
      dis = this.props.dis

    return <div className="page feed-page">
      <div className="header"></div>
      {/*
      <div className="dis-list">
        {subscriptions.map((s) => {
          return <div className={"dis-source " + (s.source === dis.source
            ? 'selected'
            : '')} onClick={this.clickDIS.bind(this, s.source)}>
            <img src={s.image || "https://www.google.com/s2/favicons?domain=javascriptweekly.com&alt=feed"} className="dis-source-image"/>
            <div className="dis-title">
              {s.title}
            </div>
          </div>
        })}
      </div>*/}
      <FeedDiv dis={this.props.dis}> </FeedDiv>
    </div>
  }
}

FeedPage.propTypes = {
  subscriptions: React.PropTypes.array.isRequired,
  dis: React.PropTypes.object.isRequired,
  retrieveDISFeeds: React.PropTypes.func.isRequired
}

export default FeedPage