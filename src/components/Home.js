import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../scss/home.scss';
import UserLogin from './Login/UserLogin';

const Home = (props) => {
  return (
    <div className="wrapper primary">
      <div className="container">
        <div className="top-bar">
          <Link className="big link" to="/" >Market Place</Link>
          <UserLogin />
        </div>
      </div>
    </div>
  )
}

export default Home;