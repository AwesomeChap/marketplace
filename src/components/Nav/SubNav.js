import React, { useState, useEffect } from 'react'
import { Form, Icon, Dropdown, Modal, Button, Menu, message } from 'antd';
import LoginForm from '../Login/LoginForm';
import SignupForm from '../Login/SignupForm';
import BikeIcon from '../../assets/customIcons/bikeIcon';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeUser} from '../../redux/actions/actions';
import axios from 'axios';
import PassReset from '../Login/PassReset';
import VerifyEmailForm from '../Login/VerifyEmail';
import _ from 'lodash';

const SubNav = (props) => {

  const [visible, setVisible] = useState(false);
  const [formIndex, setFormIndex] = useState(1);
  const [values, setValues] = useState({});

  const title = ["Log in", "Sign up", "Verify Email", "Password Reset"];

  const showModal = (e) => {
    setVisible(true);
  }

  const handleCancel = (e) => {
    setVisible(false);
    setFormIndex(1);
  }

  const showLogin = () => setFormIndex(1);

  const showSignup = () => setFormIndex(2);

  const showVerifyEmail = (val) => { setValues(val); setFormIndex(3) };

  const showPassReset = () => setFormIndex(4);

  function handleMenuClick(e) {
    if (e.key === "logout") {
      axios.post('/auth/logout')
        .then(({ data }) => {
          props.removeUser();

          return message.success(data.message);
          // props.history.push('/'); 
          // console.log(props.history);
          // window.location.pathname = "/";
        })
    }
    else {
      props.history.push(props.dashboardPath);
    }
  }

  const DropdownMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1"><Icon className="prefix-icon" type="layout" theme="filled" />Dashboard</Menu.Item>
      <Menu.Item key="logout"><Icon className="prefix-icon" type="logout" />Logout</Menu.Item>
    </Menu>
  );

  return (
    <div className="sub-nav">
      {/* <NavLink exact to="/" className="sub-nav-item" activeClassName="selected">
        <span><Icon type="home" /> Home </span>
      </NavLink> */}
      {/* <NavLink exact to="/rider" className="sub-nav-item" activeClassName="selected">
        <span><BikeIcon style={{ transform: "scale(1.35)" }} /> Rider Area</span>
      </NavLink>
      <NavLink exact to="/partner" className="sub-nav-item" activeClassName="selected">
        <span><Icon type="shop" /> Seller Area </span>
      </NavLink> */}
      {
        props.loggedIn ? (
          <>
            <div className="sub-nav-item-without-pseudo">
              <span>
                <Dropdown trigger={['click']} overlay={DropdownMenu} >
                  <Button type="primary">
                    <Icon type="user" /> {_.startCase(props.user.local.name.first)} {props.user.type != "user" && <span style={{ opacity: 0.7, padding: 0, border: 0 }}>({props.user.type})</span>}<Icon type="down" />
                  </Button>
                </Dropdown>
              </span>
            </div>
          </>

        ) : (
            <>
              <div onClick={showModal} className={"sub-nav-item-without-pseudo"}>
                <span>
                  <Button type="primary">
                    <Icon type="login" /> Login
                </Button>
                </span>
              </div >
              <Modal
                title={title[formIndex - 1]}
                visible={visible}
                onCancel={handleCancel}
                okText={null}
                cancelText={null}
                width={350}
                footer={null}
                centered={true}
                wrapClassName={"login-signup"}
                destroyOnClose={true}
                maskClosable={false}
              >
                {formIndex == 1 && <LoginForm showSignup={showSignup} showVerifyEmail={showVerifyEmail} showPassReset={showPassReset} handleCancel={handleCancel} />}
                {formIndex == 2 && <SignupForm showLogin={showLogin} showVerifyEmail={showVerifyEmail} />}
                {formIndex == 3 && <VerifyEmailForm email={values.email} showLogin={showLogin} />}
                {formIndex == 4 && <PassReset showLogin={showLogin} />}
              </Modal>
            </>
          )
      }

    </div >
  );
}

const mapsStateToProps = (state) => state;

export default withRouter(connect(mapsStateToProps, { removeUser })(SubNav));