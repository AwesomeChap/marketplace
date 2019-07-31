import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router';
import { Menu, Icon, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import '../../../scss/dashboard.scss'
import SellerDashBoard from './SellerDashboard';
import ScrollToTop from '../../Helper/ScrollToTop';
import WrappedPaypalConfig from '../CommonTabs/PaymentSettings';
import MakeSuggestions from '../CommonTabs/MakeSuggestions';

const Dashboard = (props) => {
  const [current, setCurrent] = useState("make_suggestions");
  const [collapsed, setCollapsed] = useState(true);
  let wrapperRef = useRef(null);

  const handleClick = ({ key }) => setCurrent(key);

  if (!props.loggedIn) {
    return <Redirect to="/" /> 
  }
 
  const CurrentView = {
    user_profile: <div key="user_profile" >User Profile</div>,
    seller_dashboard: <SellerDashBoard key="seller_dashboard" user={props.user} />,
    courier_dashboard: <div key="courier_dashboard">Courier Dashboard</div>,
    paypal_config: <WrappedPaypalConfig key="paypal_config" user={props.user} />,
    make_suggestions: <MakeSuggestions key="make_suggestions" user={props.user} />,
  }

  return (
    <div className="wrapper">
      <Menu style={{ maxWidth: 240 }} theme={"dark"} onClick={handleClick} selectedKeys={[current]} mode="inline" inlineCollapsed={collapsed}>
        <Menu.Item style={{ cursor: "default" }} disabled key="toggle_menu">
          <Icon className="hide-menu-btn" type={collapsed ? "menu-unfold" : "menu-fold"} onClick={() => setCollapsed(!collapsed)} />
          <span onClick={() => setCollapsed(!collapsed)}>Toggle Menu</span>
        </Menu.Item>
        <Menu.Item key="user_profile">
          <Icon type="user" />
          <span>User Profile</span>
        </Menu.Item>
        <Menu.Item key="seller_dashboard">
          <Icon type="shop" />
          <span>Seller Dashboard</span>
        </Menu.Item>
        <Menu.Item key="courier_dashboard">
          <Icon type="thunderbolt" />
          <span>Courier Dashboard</span>
        </Menu.Item>
        <Menu.Item key="paypal_config">
          <Icon type="credit-card" />
          <span>Paypal config</span>
        </Menu.Item>
        <Menu.Item key="make_suggestions">
          <Icon type="plus-square" />
          <span>Make Suggestions</span>
        </Menu.Item>
      </Menu>
      <div ref={(node) => wrapperRef = node} className="scrollable wrapper">
        {wrapperRef != null && <ScrollToTop getCurrentRef={() => wrapperRef} />}
        {/* <div className="container">
          {CurrentView[current]}
        </div> */}
        <div className="container">
          {
            Object.keys(CurrentView).map((key) => (
              <QueueAnim
                key={`${key}-tab`}
                component={"span"}
                delay={current == key ? 300 : 0}
                duration={400}
                ease={"easeOutCirc"}
                animConfig={[
                  { opacity: [1, 0], translateY: [0, 50] },
                  { opacity: [1, 0], translateY: [0, -50] }
                ]}
              >
                {current == key ? [CurrentView[key]] : [null]}
              </QueueAnim>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard;