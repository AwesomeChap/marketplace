import React, { useEffect } from 'react';
import AdminDashboard from './Dashboards/AdminDashboard';
import Dashboard from './Dashboards/Dashboard';
import '../../scss/dashboard.scss';
import Loader from '../Helper/Loader';

const Dashboards = (props) => {

  useEffect(()=>{
    if(!props.loggedIn && props.loaded){
      props.history.push('/');
    }
  },[props.loggedIn]);

  const _Dashboards_ = {
    admin: <AdminDashboard {...props} />,
    user: <Dashboard {...props} />
  }

  if (props.loaded && props.loggedIn) {
    return _Dashboards_[props.user.type];
  }
  else {
    return (
      <div className="menu-item-page">
        
      </div>
    )
  }
}

export default Dashboards
