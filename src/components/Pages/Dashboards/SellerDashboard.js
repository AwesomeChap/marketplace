import React, { useState } from 'react';
import { Tabs, Button, Icon, Dropdown, Menu } from 'antd';
import _ from 'lodash';
import SellerProfile from '../SellerDashboardTabs/SellerProfile';
import { StickyContainer, Sticky } from 'react-sticky';

const { TabPane } = Tabs;

const renderTabBar = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
    )}
  </Sticky>
);

const SellerDashBoard = (props) => {

  const [currentKey, setCurrentKey] = useState("sellerProfile");

  const TabPanes = {
    sellerProfile: <SellerProfile />,
    foodItems: <div>Food Items</div>,
    seatArrangement: <div>Seat Arrangement</div>,
    order: <div>Order</div>,
    courier: <div>Courier</div>,
    advertisement: <div>Advertisement</div>
  }

  function handleMenuClick(e) {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">
        <Icon type="environment" />
        Branch 1
      </Menu.Item>
      <Menu.Item key="2">
        <Icon type="environment" />
        Branch 2
      </Menu.Item>
      <Menu.Item key="3">
        <Icon type="environment" />
        Branch 3
      </Menu.Item>
    </Menu>
  );

  const operations = (
    <Dropdown overlay={menu}>
      <Button type="branches">
        Branches <Icon type="down" />
      </Button>
    </Dropdown>
  )

  const handleChange = key => setCurrentKey(key);

  return (
    <div className="menu-item-page">
      <StickyContainer>
        <Tabs onChange={handleChange} 
        renderTabBar={renderTabBar} 
        tabBarExtraContent={operations}
        >
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
      </StickyContainer>


    </div>
  )
}

export default SellerDashBoard;