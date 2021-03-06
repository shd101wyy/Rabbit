import React from 'react'

import FeedDiv from './feed_div.jsx'

class HomeFeedPage extends React.Component {
  constructor() {
    super()
  }

  render() {
    let subscriptions = this.props.subscriptions,
      dis = this.props.dis

    return <div className="page home-feed-page">
      <div className="header">
        <div className="column-1-1">
          Home
        </div>
      </div>
      <FeedDiv source={'localhost'}> </FeedDiv>
    </div>
  }
}

HomeFeedPage.propTypes = {
  source: React.PropTypes.string.isRequired,
}

export default HomeFeedPage