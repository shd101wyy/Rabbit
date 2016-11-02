import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

import userAPI from '../api/user_api.js'

class App extends React.Component {
  componentDidMount() {
    ipcRenderer.send('check-auth')
    ipcRenderer.once('return-auth', function(event, data) {
      if (!data.success) {
        browserHistory.push('/login')
      } else {
        const {email, password} = data.data
        userAPI.login(email, password, function(data) {
          if (data.success) {
            browserHistory.push('/')
          } else {
            browserHistory.push('/login')
          }
        })
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