import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'

class NotFound extends React.Component {
  constructor() {
    super()
    console.log('init not found')
  }
  render() {
    return <div>
      Home
    </div>
  }
}

export default NotFound