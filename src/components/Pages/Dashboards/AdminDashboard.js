import React, { useState } from 'react';
import { Menu, Icon } from 'antd';
import VerifyEmailConfig from '../AdminDashboardTabs/VerifyEmailConfig';
import ADMI from '../AdminDashboardTabs/AdminDashboardMenuItems';
import CategorizationConfig from '../AdminDashboardTabs/CategorizationConfig';

const { SubMenu } = Menu;

const AdminDashboard = (props) => {

  console.log(props)

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
      <div className="container">
        <div className="space-between">
          <div style={{ width: 320 }} className="scrollable wrapper">
            <div className="container">
              <Menu
                // style={{ width: 256 }}
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
                  {ADMI.verifyEmail.map(
                    (item, i) => (
                      <Menu.Item key={i + 1}>
                        <a href={`#${i + 1}`} rel="noopener noreferrer">
                          <Icon type="right" />{item}
                        </a>
                      </Menu.Item>
                    )
                  )}
                </SubMenu>
                <SubMenu
                  key="sub2"
                  onTitleClick={handleClick}
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
                          <Icon type="right" />{item}
                        </a>
                      </Menu.Item>
                    )
                  )}
                </SubMenu>
              </Menu>
            </div>
          </div>
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