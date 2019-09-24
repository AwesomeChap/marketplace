import React, { useEffect, useState } from 'react';
import { Card, List, Icon, Tag, Divider, Button, Row, Col } from 'antd';
import { iconFontCNUrl } from '../../../keys';
import _ from 'lodash';
import { AES } from 'crypto-js';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFontCNUrl,
});

const getHighlightedText = (text, highlight, bold) => {
  // Split text on higlight term, include term itself into parts, ignore case
  var parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return <span>{parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <span style={{ color: "#1890ff", fontWeight: bold && "bolder" }}>{part}</span> : part)}</span>;
}

const Restaurant = (props) => {
  return (
    <List.Item
      key={props._id}
      style={{ cursor: "pointer" }}
    >
      <div className="restaurant-card-wrapper">
        <div className="restaurant-card">
          <img src={props.logoUrl} />
          <div className="restaurant-content-wrapper">
            <div className="restaurant-card-content">
              <div className="restaurant-card-content-block">
                <div className="restaurant-name">
                  <b>{props.searchOption === "restaurants" ? getHighlightedText(props.restaurantName, props.searchText, false) : props.restaurantName}</b> {!props.status ? <span style={{ color: "#999", marginLeft: 16 }}><Icon theme="filled" type="clock-circle" /> Closed</span> : <span style={{ color: "#52c41a", marginLeft: 16 }}><Icon theme="filled" type="check-circle" /> Open</span>}
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
        
        {props.searchOption === "dishes" && <div className="dishes">
          {props.dishes.map(dish => _.toLower(dish).includes(_.toLower(props.searchText)) && <Tag key={_.camelCase(dish)}>{getHighlightedText(dish, props.searchText, true)}</Tag>)}
        </div>}

        <Row type="flex">
            <Col span={12}><Button onClick={e => props.history.push(`restaurant/online/${props.rst_id}/${props._id}`)} style={{width: "100%", borderRadius: 0, textAlign: "center"}} type="primary"><IconFont style={{fontSize: 18}} type="icon-orderonline" />Order online</Button></Col>
            <Col span={12}><Button style={{width: "100%", borderRadius: 0, textAlign: "center"}} type="primary"><IconFont style={{fontSize: 18}} type="icon-Reservations" />Book Table</Button></Col>
        </Row>
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
        return <Restaurant {...props} key={item._id} {...item} />
      }}
    />
  )
}

export default Restaurants;