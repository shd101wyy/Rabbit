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
import SearchPage from './search_page.jsx'
import HomeFeedPage from './home_feed_page.jsx'
import SubscriptionsPage from './subscriptions_page.jsx'
import DISPage from './DISPage.jsx'

// check
// https://github.com/ReactTraining/react-router/blob/master/examples
ReactDOM.render(
  <Router history={browserHistory}>
  <Route path="/" component={App}>
    <Route path="/rabbit" component={Home}>
      <Route path="/rabbit/home_feed_page" component={HomeFeedPage} />
      <Route path="/rabbit/search_page" component={SearchPage} />
      <Route path="/rabbit/subscriptions_page" component={SubscriptionsPage} />
      <Route path="/dis/:source" component={DISPage}/>
      {/*<Route path="/home_feed_page" component={} />*/}
    </Route>
    <Route path="/login" component={LoginSignup} />
    <Route path="*" component={NotFound} />
  </Route>
</Router>, document.getElementById('root'))
