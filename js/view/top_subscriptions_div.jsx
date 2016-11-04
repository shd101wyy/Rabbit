import React from 'react'

import DisSource from './dis_source.jsx'
import homeAPI from '../api/home_api.js'

class TopSubscriptionsDiv extends React.Component {
  constructor() {
    super()
    this.state = {
      diss: [],
    }
  }

  componentDidMount() {
    homeAPI.getTopSubscriptions({page: 0, count: 20}, (data)=> {
      if (data.success) {
        this.setState({diss: data.data})
      }
    })
  }

  render() {
    return <div className="top-subscriptions-div">
      {this.state.diss.map((dis)=> {
        return <DisSource dis={dis}></DisSource> // TODO: DisSource following 应该给删掉
      })}
    </div>
  }
}

export default TopSubscriptionsDiv