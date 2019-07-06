import React, { useState, useEffect } from 'react'
import { Form, Icon, Dropdown, Modal, Button, Menu, message } from 'antd';
import LoginForm from '../Login/LoginForm';
import SignupForm from '../Login/SignupForm';
import BikeIcon from '../../assets/customIcons/bikeIcon';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser } from '../../redux/actions/actions';
import axios from 'axios';

const SubNav = (props) => {

  const [visible, setVisible] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const title = showLoginForm ? "Log in" : "Sign up";

  const showModal = (e) => {
    setVisible(true);
    setShowLoginForm(true);
  }

  const handleCancel = (e) => {
    setVisible(false);
  }

  const showLogin = () => setShowLoginForm(true);

  const showSignup = () => setShowLoginForm(false);

  function handleMenuClick(e) {
    if (e.key == "2") {
      axios.post('/auth/logout')
        .then(({ data }) => {
          message.success(data.message);
          props.removeUser();
        })
    }
    else {
      props.history.push('/me/dashboard');
    }
  }

  const DropdownMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1"><Icon className="prefix-icon" type="deployment-unit" />Dashboard</Menu.Item>
      <Menu.Item key="2"><Icon className="prefix-icon" type="logout" />Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="sub-nav">
      <NavLink exact to="/" className="sub-nav-item" activeClassName="selected">
        <span><Icon type="home" /> Home </span>
      </NavLink>
      <NavLink exact to="/rider" className="sub-nav-item" activeClassName="selected">
        <span><BikeIcon style={{ transform: "scale(1.35)" }} /> Become a Rider </span>
      </NavLink>
      <NavLink exact to="/partner" className="sub-nav-item" activeClassName="selected">
        <span><Icon type="shop" /> Sell with us </span>
      </NavLink>
      {
        props.loggedIn ? (
          <>
            <div className="sub-nav-item-without-pseudo">
              <span>
                <Dropdown trigger={['click']} overlay={DropdownMenu} >
                  <Button type="primary">
                    <Icon type="user" /> Me <Icon type="down" />
                  </Button>
                </Dropdown>
              </span>
            </div>
          </>

        ) : (
            <>
              <button onClick={showModal} className={"sub-nav-item-without-pseudo"}>
                <span>
                  <Button type="primary">
                    <Icon type="login" /> Login
                </Button>
                </span>
              </button >
              <Modal
                title={title}
                visible={visible}
                onCancel={handleCancel}
                okText={null}
                cancelText={null}
                width={350}
                footer={null}
                centered={true}
                destroyOnClose={true}
                maskClosable={false}
              >
                {
                  showLoginForm ? (
                    <LoginForm showSignup={showSignup} handleCancel={handleCancel} />
                  ) : (
                      <SignupForm showLogin={showLogin} handleCancel={handleCancel} />
                    )
                }
              </Modal>
            </>
          )
      }

    </div >
  );
}

const mapsStateToProps = (state) => state;

export default withRouter(connect(mapsStateToProps, { removeUser })(SubNav));