import React, { useState, useEffect } from 'react'
import { Form, Icon, Popover, Tooltip, Checkbox, Input, Button, Divider, Modal } from 'antd';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ShopIcon from '../../customIcons/shopIcon';
import ScooterIcon from '../../customIcons/scooterIcon';
import DealIcon from '../../customIcons/dealIcon';
import BikeIcon from '../../customIcons/bikeIcon';
import Texty from 'rc-texty';

const LoginOptions = (props) => (
  <>
    <Form>
      <Form.Item>
        <Button type="primary" onClick={props.showLogin} className="center-me" >Continue with email</Button>
      </Form.Item>
      <Divider>OR</Divider>
      <div className="other-login-options">
        <button className="custom-icon-button google"><i class="fab fa-google"></i> <Divider type="vertical" /> <span>Google</span> </button>
        <button className="custom-icon-button facebook"><i class="fab fa-facebook-f"></i> <Divider type="vertical" /> <span>Facebook</span> </button>
        <button className="custom-icon-button linkedin"><i class="fab fa-linkedin-in"></i> <Divider type="vertical" /> <span>Linkedin</span> </button>
      </div>
    </Form>
  </>
)

const UserLogin = (props) => {

  const [visible, setVisible] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const title = showLoginForm ? "Log in" : "Sign up";

  const showModal = (e) => {
    setVisible(true);
    setShowLoginForm(true);
  }

  const handleLogin = (e) => {
    setVisible(false);
  }

  const handleCancel = (e) => {
    setVisible(false);
  }

  const showLogin = () => setShowLoginForm(true);

  const showSignup = () => setShowLoginForm(false);

  return (
    <div className="sub-nav">
      <button className={"sub-nav-item"}>
        <span> <BikeIcon style={{ transform: "scale(1.35)" }} /> Become a Rider </span>
      </button>
      <button className={"sub-nav-item"}>
        <span> <Icon type="shop" /> Sell with us </span>
      </button>
      <button onClick={showModal} className={"sub-nav-item"}>
        <span> <Icon type="login" /> Login </span>
      </button>
      <Modal
        title={title}
        visible={visible}
        onCancel={handleCancel}
        okText={null}
        cancelText={null}
        width={350}
        footer={null}
        centered={true}
      >
        {
          showLoginForm ? (
            <LoginForm showSignup={showSignup} handleCancel={handleCancel} />
          ) : (
            <SignupForm showLogin={showLogin} handleCancel={handleCancel} />
          )
        }
      </Modal>
    </div>
  );
}

export default Form.create({ name: "user_login" })(UserLogin);
