import React, { useEffect } from 'react';
import AdminDashboard from './Dashboards/AdminDashboard';
import Dashboard from './Dashboards/Dashboard';
import '../../scss/dashboard.scss';
import Loader from '../Helper/Loader';
import { Redirect } from 'react-router-dom';
import SellerDashboard from './Dashboards/SellerDashboard';

const Dashboards = (props) => {

  const _Dashboards_ = {
    admin: <AdminDashboard {...props} />,
    user: <Dashboard {...props} />,
    // seller: <SellerDashboard {...props} />
  }

  console.log(props.loggedIn, props.user);

  if (!(props.loggedIn && !!props.user)) {
    return <Redirect to='/' />
  }

  return _Dashboards_[props.user.type];
}

export default Dashboards
