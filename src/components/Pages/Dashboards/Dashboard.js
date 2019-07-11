import React from 'react';
import {Redirect} from 'react-router';

const Dashboard = (props) => {
  console.log('Dashboard',props);

  if(!props.loggedIn){
    return <Redirect to="/"/>
  }

  return(
    <div className="wrapper">
      <div className="container">
        Dashboard Page
      </div>
    </div>
  )
}

export default Dashboard;