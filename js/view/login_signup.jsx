import React from 'react'
import {browserHistory} from 'react-router'
const {ipcRenderer} = require('electron')

import userAPI from '../api/user_api.js'
import notificationsStore from '../model/notifications_store.js'

class LoginSignup extends React.Component {
  constructor() {
    super()

    this.state = {
      loginPage: true
    }

    this.switchPage = this.switchPage.bind(this)
  }

  componentDidMount() {
    /*
    userAPI.checkAuth(function(res) {
      if (res && res.success) {
        browserHistory.push('/')
      }
    })
    */
  }

  switchPage() {
    let loginPage = this.state.loginPage
    this.setState({
      loginPage: !loginPage
    })
  }

  login() {
    let email = this.refs['email'].value,
      password = this.refs['password'].value

    userAPI.login(email, password, (res)=> {
      if (res.success) {
        window.userId = res.userId
        ipcRenderer.send('save-user-info', {email, password})
        notificationsStore.init()
        browserHistory.push('/')
      }
    })
  }

  signup() {
    let username = this.refs['username'].value,
      password = this.refs['password'].value,
      email = this.refs['email'].value

    console.log('signup: ', username, password, email)
    userAPI.signup(email, username, password, (res)=> {
      if (res.success) {
        window.userId = res.userId
        ipcRenderer.send('save-user-info', {email, password})
        notificationsStore.init()
        browserHistory.push('/')
      }
    })
  }

  render() {
    return <div className="login-page">
      <div className="form">
        <div className="login-form">
          <input ref="email" type="text" placeholder="email address"/>
          {this.state.loginPage
            ? null
            : <input ref="username" type="text" placeholder="username"/>
          }
          <input ref="password" type="password" placeholder="password"/>
          {this.state.loginPage
            ? <button onClick={this.login.bind(this)}>login</button>
            : <button onClick={this.signup.bind(this)}>create</button>
          }
          {this.state.loginPage
            ? <p className="message">Not registered?
                <a style={{
                  cursor: 'pointer'
                }} onClick={this.switchPage}>Create an account</a>
              </p>
            : <p className="message">Already registered?
              <a style={{
                cursor: 'pointer'
              }} onClick={this.switchPage}>Sign In</a>
            </p>
          }
        </div>
      </div>
    </div>
  }
}

export default LoginSignup