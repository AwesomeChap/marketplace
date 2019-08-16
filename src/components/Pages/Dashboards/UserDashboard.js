import React, { useEffect, useState } from 'react';
import { Tabs, Button, Icon, Dropdown, Menu, message, Input, Empty } from 'antd';
import _ from 'lodash';
import Loader from '../../Helper/Loader';
import UserProfile from '../UserDashboard/UserProfile';
import UserOrderHistory from '../UserDashboard/UserOrderHistory';

const { TabPane } = Tabs;

const UserDashboard = (props) => {

  const [currentKey, setCurrentKey] = useState("profile");
  const [loading, setLoading] = useState(false);

  const TabPanes = {
    profile: <UserProfile />,
    orderHistory: <UserOrderHistory />
  }

  const handleChange = key => setCurrentKey(key);

  return (
    <div style={{ paddingBottom: 0 }} className="menu-item-page">
      <Tabs destroyInactiveTabPane={true} onChange={handleChange} activeKey={currentKey}>
        {
          Object.keys(TabPanes).map((key) => {
            return (
              <TabPane tab={_.startCase(key)} key={key}>
                {TabPanes[key]}
              </TabPane>
            )
          })
        }
      </Tabs>
    </div>
  )
}

export default UserDashboard;