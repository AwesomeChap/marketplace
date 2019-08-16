import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Nav/Navbar';
import Dashboard from './components/Pages/Dashboards/Dashboard';
import Home from './components/Pages/Home';
import { connect } from 'react-redux';
import { saveUser, setLoading, saveErrors } from './redux/actions/actions';
import { message } from 'antd';
import Loader from './components/Helper/Loader';
import ScrollToTop from './components/Helper/ScrollToTop';
import AdminDashboard from './components/Pages/Dashboards/AdminDashboard';

const App = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!props.loggedIn) {

      props.setLoading();
      setLoading(true);
      axios.get('/auth/user')
        .then(({ data: { user } }) => {
          props.saveUser(user);
          setLoading(false);
          if (user != null) {
            return message.success("Logged in!");
          }
        })
        .catch(e => { setLoading(false); props.saveErrors(e.response.data); });
    }
  }, []);

  const { loggedIn, loaded, user } = props;


  if (loading) {
    return <Loader />
  }

  let dashboardPath = "/me/dashboard"

  if (user && props.user.type == "admin") {
    dashboardPath = `/admin/dashboard`;
  }

  return (
    <>
      <Router>
        <Navbar dashboardPath={dashboardPath} />
        <Route exact path="/" render={(props) => <Home {...props} user={user} loggedIn={loggedIn} loaded={loaded} dashboardPath={dashboardPath} />} />
        <Route exact path={"/admin/dashboard"} render={(props) => <AdminDashboard {...props} user={user} loggedIn={loggedIn} loaded={loaded}/>} />
        <Route exact path={"/me/dashboard"} render={(props) => <Dashboard {...props} user={user} loggedIn={loggedIn} loaded={loaded} />} />
      </Router>
    </>
  )
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, { saveUser, setLoading, saveErrors })(App);
