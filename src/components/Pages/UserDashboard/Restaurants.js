import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';

const Restaurant = (props) => {
  return (
    <List.Item
      onClick={e => console.log(props._id)}
      key={props._id}
      style={{ cursor: "pointer" }}
    >
      <Card>
        {props.restaurantName}
      </Card>
    </List.Item>
  )
}

const Restaurants = (props) => {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={props.restaurants}
      renderItem={item => {
        return <Restaurant {...item} />
      }}
    />
  )
}

export default Restaurants;