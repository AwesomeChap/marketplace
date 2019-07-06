import React, { useEffect } from 'react';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Nav/Navbar';
import Dashboard from './components/Pages/Dashboard';
import Home from './components/Pages/Home';
import { connect } from 'react-redux';
import { saveUser } from './redux/actions/actions';
import qs from 'query-string';
import { message } from 'antd';

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
    const queryParams = qs.parse(window.location.search);
    if (Object.prototype.hasOwnProperty.call(queryParams, "verify")) {
      // if(queryParams.hasOwnProperty("verify")){
      const token = {
        _userId: queryParams.verify
      }
      axios.post('/auth/verifyToken', { token }).then(({ data }) => {
        history.pushState({}, null, "hello");
        // setTimeout(()=>{window.location.search = "";},2000);
        return message.success("Email verified");
      })
    }
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