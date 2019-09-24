import React from 'react';
import { Card, Tabs, Col, Row } from 'antd';

const Dish = ({ dish }) => {
  console.log(dish.image.thumbUrl);
  return (
    <>
      <Col style={{ marginTop: 16 }} span={12}>
        <Card
          hoverable
          // style={{ width: 200 }}
          cover={<img alt="example" src={dish.image[0].thumbUrl} />}
        >
          <Card.Meta title={dish.name} description={dish.type} />
        </Card>
      </Col>
      {/* needs to be removed */}
      <Col style={{ marginTop: 16 }} span={12}>
        <Card
          hoverable
          // style={{ width: 200 }}
          cover={<img alt="example" src={dish.image[0].thumbUrl} />}
        >
          <Card.Meta title={dish.name} description={dish.type} />
        </Card>
      </Col>
      {/* needs to be removed */}
      <Col style={{ marginTop: 16 }} span={12}>
        <Card
          hoverable
          // style={{ width: 200 }}
          cover={<img alt="example" src={dish.image[0].thumbUrl} />}
        >
          <Card.Meta title={dish.name} description={dish.type} />
        </Card>
      </Col>
    </>
  )
}

const RestaurantDishes = props => {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Dishes" key="1">
          <Row className="dishes" gutter={16}>{props.dishes.map(dish => <Dish key={dish._id} dish={dish} />)}</Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Reviews" key="2">
          Reviews by users
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default RestaurantDishes;