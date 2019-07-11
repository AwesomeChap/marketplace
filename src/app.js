import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Nav/Navbar';
import Dashboards from './components/Pages/Dashboards';
import Home from './components/Pages/Home';
import { connect } from 'react-redux';
import { saveUser, setLoading, saveErrors } from './redux/actions/actions';
import { message } from 'antd';

const App = (props) => {

  useEffect(() => {
    if (!props.loggedIn) {

      props.setLoading();

      axios.get('/auth/user')
        .then(({ data: { user } }) => {
          props.saveUser(user);
          if (user != null) {
            return message.success("Logged in!");
          }
        })
        .catch(e => props.saveErrors(e.response.data));
    }
  }, []);

  const {loggedIn, loaded, user} = props;

  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route exact path="/me/dashboard" render={(props) => <Dashboards {...props} user={user} loggedIn={loggedIn} loaded={loaded}/>} />
    </Router>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, { saveUser, setLoading, saveErrors })(App);
