import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Nav/Navbar';
import Dashboard from './components/Pages/Dashboard';
import Home from './components/Pages/Home';
import { connect } from 'react-redux';
import { saveUser } from './redux/actions/actions';

function PrivateRoute({ component: Component, loggedIn, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        loggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

const App = (props) => {

  useEffect(() => {
    if (!props.loggedIn) {
      axios.get('/auth/user')
        .then(({ data: { user } }) => {
          if (user != null) {
            props.saveUser(user);
          }
        })
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
      <PrivateRoute loggedIn={props.loggedIn} exact path="/me/Dashboard" component={Dashboard} />
    </Router>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, { saveUser })(App);