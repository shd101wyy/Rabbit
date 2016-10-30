import React from 'react'
import { browserHistory } from 'react-router'
const {ipcRenderer} = require('electron')

// import userAPI from '../api/user_api.js'

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
    let username = this.refs['username'].value,
      password = this.refs['password'].value

    /*
    console.log('login: ', username, password)
    userAPI.login(username, password, (res)=> {
      if (res.success) {
        ipcRenderer.send('save-user-info', {username, password})
        browserHistory.push('/')
      }
    })
    */
  }

  signup() {
    let username = this.refs['username'].value,
      password = this.refs['password'].value,
      email = this.refs['email'].value

    /*
    console.log('signup: ', username, password, email)
    userAPI.signup(email, username, password, (res)=> {
      if (res.success) {
        console.log(res)
        ipcRenderer.send('save-user-info', {username, password})
        browserHistory.push('/')
      }
    })
    */
  }

  render() {
    return <div className="login-page">
      <div className="form">
        <div className="login-form">
          <input ref="username" type="text" placeholder="username"/>
          <input ref="password" type="password" placeholder="password"/> {this.state.loginPage
            ? null
            : <input ref="email" type="text" placeholder="email address"/>
}
          {this.state.loginPage
            ? <button onClick={this.login.bind(this)}>login</button>
            : <button onClick={this.signup.bind(this)}>create</button>
}
          {this.state.loginPage
            ? <p className="message">Not registered?
                <a style={{cursor: 'pointer'}} onClick={this.switchPage}>Create an account</a>
              </p>
            : <p className="message">Already registered?
              <a style={{cursor: 'pointer'}} onClick={this.switchPage}>Sign In</a>
            </p>
}
        </div>
      </div>
    </div>
  }
}

export default LoginSignup