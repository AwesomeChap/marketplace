import React, { useState } from 'react';
import { Menu, Icon } from 'antd';
import VerifyEmailConfig from './AdminDashboardTabs/VerifyEmailConfig';

const { SubMenu } = Menu;

const AdminDashboard = (props) => {

  console.log(props)

  const [tabIndex, setTabIndex] = useState("sub1");

  const tabs = {
    "sub1": <VerifyEmailConfig user={props.user} />,
    "sub2": "",
  }

  const handleClick = e => {
    if(e.key){
      setTabIndex(e.key);
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="space-between">
          <Menu 
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            openKeys={[tabIndex]}
            mode="inline"
            // inlineCollapsed={true}
          >
            <SubMenu
              key="sub1"
              onTitleClick={handleClick}
              title={
                <span>
                  <Icon type="mail" />
                  <span>Verify Email</span>
                </span>
              }
            >
              <Menu.Item > <a href="#1" rel="noopener noreferrer"><Icon type="setting"/> SMTP Config </a> </Menu.Item>
              <Menu.Item > <a href="#2" rel="noopener noreferrer"><Icon type="appstore"/> Mail Options </a> </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              onTitleClick={handleClick}
              title={
                <span>
                  <Icon type="appstore" />
                  <span>Navigation Two</span>
                </span>
              }
            >
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu
              key="sub4"
              title={
                <span>
                  <Icon type="setting" />
                  <span>Navigation Three</span>
                </span>
              }
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
          <div className="scrollable wrapper">
            <div className="container">
              {tabs[tabIndex]}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;