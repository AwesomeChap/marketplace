import React, { useEffect, useState } from 'react';
import { Card, List, Icon, Tag } from 'antd';
import { iconFontCNUrl } from '../../../keys';
import moment from 'moment';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFontCNUrl,
});

const Restaurant = (props) => {
  return (
    <List.Item
      onClick={e => console.log(props._id)}
      key={props._id}
      style={{ cursor: "pointer" }}
    >
      <div className="restaurant-card">
        <img src={props.logoUrl} />
        <div className="restaurant-content-wrapper">
          <div className="restaurant-card-content">
            <div className="restaurant-card-content-block">
              <div className="restaurant-name"> 
                <b>{props.restaurantName}</b> {!props.status ? <span style={{color:"#ff4d4f", marginLeft: 16}}><Icon theme="filled" type="clock-circle" /> Closed</span> : <span style={{color:"#52c41a", marginLeft: 16}}><Icon theme="filled" type="check-circle"/> Open</span>}
              </div>
              <div className="rating" style={{ color: "#1890ff" }}> 
                <Icon theme="filled" type="star" /> {parseFloat(Math.round(props.rating * 10) / 10).toFixed(1)} <span>100 ratings</span> . <span>Cost For One £{props.costForOne}</span>
              </div>
              <div className="available-services">{props.serviceOptions.join(" . ")}</div>
            </div>
            <div className="restaurant-card-content-block">
              {!!props.discount && <div style={{ color: "#52c41a" }}><IconFont type="icon-discount" /> {props.discount}% off when you spend £{props.discountMinOrder} </div>}
              <div><IconFont type="icon-distance-road" /> {Math.round(props.distance / 100) / 10}km away </div>
              {!!props.serviceOptions.includes("Delivery") && <div><IconFont type="icon-delivery" /> {props.delivery.cost ? `Delivery Cost £${props.delivery.cost}` : <span style={{ color: "#52c41a" }}>FREE Delivery</span>} . Min order £{props.minOrder}  </div>}
            </div>
          </div>
          <div className="restaurant-card-content-block">
            <div className="categories">{props.categories.map(cat => <Tag>{cat}</Tag>)}</div>
          </div>
        </div>
      </div>
    </List.Item>
  )
}

const Restaurants = (props) => {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={props.restaurants}
      renderItem={item => {
        return <Restaurant key={item._id} filterOptions={props.filterOptions} {...item} />
      }}
    />
  )
}

export default Restaurants;