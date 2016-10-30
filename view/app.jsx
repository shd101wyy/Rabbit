import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

import userAPI from '../api/user_api.js'

class App extends React.Component {
  componentDidMount() {
    ipcRenderer.send('check-auth')
    ipcRenderer.once('return-auth', function(event, data) {
      console.log(data)
      if (!data.success) {
        browserHistory.push('/login')
      } else {
        browserHistory.push('/')
      }
    })
    browserHistory.push('/')
  }
  render() {
    return  <div>
      {this.props.children}
    </div>
  }
}

export default App