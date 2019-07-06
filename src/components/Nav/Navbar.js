import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../../scss/nav.scss';
import SubNav from './SubNav';

const Navbar = (props) => {
  return (
    <div className="wrapper primary">
      <div className="container">
        <div className="top-bar">
          <Link className="big link" to="/" >Market Place</Link>
          <SubNav />
        </div>
      </div>
    </div>
  )
}

export default Navbar;