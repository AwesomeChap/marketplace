import React, { useState } from 'react';
import { Menu, Icon } from 'antd';
import VerifyEmailConfig from '../AdminDashboardTabs/VerifyEmailConfig';
import ADMI from '../AdminDashboardTabs/AdminDashboardMenuItems';
import CategorizationConfig from '../AdminDashboardTabs/CategorizationConfig';

const { SubMenu } = Menu;

const AdminDashboard = (props) => {

  const [tabIndex, setTabIndex] = useState("sub2");

  const tabs = {
    "sub1": <VerifyEmailConfig user={props.user} />,
    "sub2": <CategorizationConfig user={props.user} />,
  }

  const handleClick = e => {
    if (e.key) {
      setTabIndex(e.key);
    }
  };

  return (
    <div className="wrapper">
      <div style={{ width: 320 }} className="scrollable wrapper">
        <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} openKeys={[tabIndex]} mode="inline">
          <SubMenu key="sub1" onTitleClick={handleClick}
            title={
              <span>
                <Icon type="mail" />
                <span>Verify Email</span>
              </span>
            }
          >
            {ADMI.verifyEmail.map(
              (item, i) => (
                <Menu.Item key={i + 1}>
                  <a href={`#${i + 1}`} rel="noopener noreferrer"><Icon type="setting" />{item}</a>
                </Menu.Item>
              )
            )}
          </SubMenu>
          <SubMenu key="sub2" onTitleClick={handleClick}
            title={
              <span>
                <Icon type="appstore" />
                <span>Categorization</span>
              </span>
            }
          >
            {ADMI.categorization.map(
              (item, i) => (
                <Menu.Item key={i + ADMI.verifyEmail.length}>
                  <a href={`#${i + 1}`} rel="noopener noreferrer">
                    <Icon type="setting" />{item}
                  </a>
                </Menu.Item>
              )
            )}
          </SubMenu>
          <Menu.Item onClick={handleClick} key="sub3"><Icon type="shop" />Food Provider</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub4"><Icon type="pound" />Commission</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub5"><Icon type="credit-card" />Payment</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub6"><Icon type="container" />Order</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub7"><Icon type="frown" />Complaints</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub8"><Icon type="global" />Advertisement</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub9"><Icon type="team" />Customer</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub10"><Icon type="red-envelope" />Courier</Menu.Item>
        </Menu>
      </div>
      <div className="scrollable wrapper">
        <div className="container">{tabs[tabIndex]}</div>
      </div>
    </div>
  )
}

export default AdminDashboard;