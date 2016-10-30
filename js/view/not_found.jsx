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
      Page not Found
    </div>
  }
}

export default NotFound