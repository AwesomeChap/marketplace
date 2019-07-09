import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Nav/Navbar';
import Dashboard from './components/Pages/Dashboard';
import Home from './components/Pages/Home';
import { connect } from 'react-redux';
import { saveUser } from './redux/actions/actions';
import qs from 'query-string';
import { message } from 'antd';
import AdminDashboard from './components/Pages/AdminDashboard';

function PrivateRoute({ component: Component, loggedIn, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        loggedIn ? (
          <Component user={user} {...props} />
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

  const [user, setUser] = useState({});

  useEffect(() => {
    if (!props.loggedIn) {
      axios.get('/auth/user')
        .then(({ data: { user } }) => {
          if (user != null) {
            props.saveUser(user);
            setUser(user);
            return message.success("Logged in!");
          }
        })
    }
  }, []);

  const devDashboards = {
    admin : <AdminDashboard user={user}/>,
    user : <Dashboard user={user}/>
  }

  const Dashboards = {
    admin : AdminDashboard,
    user : Dashboard
  }

  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
      {/* <Route exact path="/me/dashboard" render = {()=>devDashboards[user.type]} /> */}
      <PrivateRoute user={props.user} loggedIn={props.loggedIn} exact path="/me/dashboard" component={Dashboards[user.type]} />
    </Router>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, { saveUser })(App);