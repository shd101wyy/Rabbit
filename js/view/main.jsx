import '../../bundle.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {
  Router,
  Route,
  Link,
  browserHistory,
  hashHistory,
  IndexRoute
} from 'react-router'

import App from './app.jsx'
import LoginSignup from './login_signup.jsx'
import Home from './home.jsx'
import NotFound from './not_found.jsx'

// check
// https://github.com/ReactTraining/react-router/blob/master/examples
ReactDOM.render(
  <Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute path="/home" component={Home} />
    <Route path="/login" component={LoginSignup} />
    <Route path="*" component={NotFound} />
  </Route>
</Router>, document.getElementById('root'))
