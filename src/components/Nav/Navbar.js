import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../../scss/nav.scss';
import SubNav from './SubNav';

const Navbar = (props) => {
  return (
    <div className="sticky nav wrapper primary">
      <div className="container">
        <div className="space-between">
          <Link className="big link" to="/" >Market Place</Link>
          <SubNav />
        </div>
      </div>
    </div>
  )
}

export default Navbar;