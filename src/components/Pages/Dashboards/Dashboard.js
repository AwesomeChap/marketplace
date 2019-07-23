import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Menu, Icon, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import '../../../scss/dashboard.scss'
import SellerDashBoard from './SellerDashboard';

const Dashboard = (props) => {
  const [current, setCurrent] = useState("seller_dashboard");
  const [collapsed, setCollapsed] = useState(true);

  const handleClick = ({ key }) => setCurrent(key);

  if (!props.loggedIn) {
    return <Redirect to="/" />
  }

  const CurrentView = {
    user_profile: <div key="user_profile" >User Profile</div>,
    seller_dashboard: <SellerDashBoard key="seller_dashboard"/>,
    courier_dashboard: <div key="courier_dashboard">Courier Dashboard</div>
  }

  return (
    <div className="wrapper">
      <Menu style={{maxWidth: 240}} onClick={handleClick} selectedKeys={[current]} mode="inline" inlineCollapsed={collapsed}>
        <Menu.Item style={{cursor: "default"}} disabled key="toggle_menu">
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
      </Menu>
      <div className="scrollable wrapper">
        <div className="container">
          {
            Object.keys(CurrentView).map((key) => (
              <QueueAnim
                  key={`${key}-tab`} 
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