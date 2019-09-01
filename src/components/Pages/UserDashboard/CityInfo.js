import React from 'react';
import { Icon, Button, Row, Col, Tag } from 'antd';
import { iconFontCNUrl } from '../../../keys';
import moment from 'moment';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFontCNUrl,
});

const CityInfo = (props) => {
  const currentTime = moment().format("hh:mm A");

  return (
    <Row style={{margin: "4px 4px -8px 4px"}}>
      <Col><b>{props.info.restaurantName}</b></Col>
      <Row style={{marginTop: 8}} gutter={16} type="flex" justify="space-between">
        <Col className="rating" style={{ color: "#1890ff" }}>
          <Icon theme="filled" type="star" /> {parseFloat(Math.round(props.info.rating * 10) / 10).toFixed(1)}
        </Col>
        <Col><IconFont type="icon-distance-road" /> {Math.round(props.info.distance / 100) / 10}km </Col>
        <Col>{moment(currentTime, "hh:mm A").isBefore(moment("10:00 AM", "hh:mm A")) || moment(currentTime, "hh:mm A").isAfter(moment("06:00 PM", "hh:mm A")) ? <Tag color="#ff4d4f">Closed</Tag> : <Tag color="#52c41a">Open</Tag>}</Col>
      </Row>
      <Button type="link" style={{ padding: 0 }}>View more</Button>
    </Row>
  );
}

export default CityInfo;