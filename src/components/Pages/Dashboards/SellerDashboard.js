import React, { useState } from 'react';
import { Tabs } from 'antd';
import _ from 'lodash';

const { TabPane } = Tabs;

const SellerDashBoard = (props) => {

  const [currentKey, setCurrentKey] = useState("foodItems");

  const TabPanes = {
    foodItems: <div>Food Items</div>,
    seatArrangement: <div>Seat Arrangement</div>,
    order: <div>Order</div>,
    courier: <div>Courier</div>,
    advertisement: <div>Advertisement</div>
  }

  const handleChange = key => setCurrentKey(key);

  return (
    <div className="menu-item-page">

      <Tabs onChange={handleChange} >
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

export default SellerDashBoard;