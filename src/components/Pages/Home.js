import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col, TimePicker, Card, Input, Button, Menu, Dropdown } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import axios from 'axios';
import Loader from '../Helper/Loader';
import CategoryView from './HomeSubComp/CategoryView';
import CostForOneView from './HomeSubComp/CostForOne';
import MoreFiltersView from './HomeSubComp/MoreFilters';

const Home = (props) => {

  const [advts, setAdvts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [time, setTime] = useState(null);
  const [timeVisibility, setTimeVisibility] = useState(false);
  const [selectedFoodType, setSelectedFoodType] = useState("Both");

  const moreFilters = ["Dining In", "Take Away", "Delivery", "Special Offers", "Alcohol served", "Alcohol Not Allowed", "Smoking Not Allowed "]
  const sortOptions = ["Distance", "Min Order", "Cost for one", "Rating"];

  useEffect(() => {
    if (!!props.location) {
      setLoading(true);
      axios.all([
        fetchAdvts(props.location.geometry.latitude, props.location.geometry.longitude),
        fetchRestaurants(props.location.geometry.latitude, props.location.geometry.longitude),
        fetchOptions(),
      ])
        .then(axios.spread((
          resAdvts, resRestaurants,
          resOptions) => {
          setRestaurants(resRestaurants.data.restaurants);
          setAdvts([].concat.apply([], resAdvts.data.advts));
          setOptions(resOptions.data.options);
          setLoading(false);
        })).catch(e => setLoading(false))
    }
  }, [props.location]);

  useEffect(() => console.log(time), [time]);

  const fetchAdvts = (lat, long) => {
    return axios.get(`/advertisement/show?lat=${lat}&long=${long}`)
  }

  const fetchRestaurants = (lat, long) => {
    return axios.get(`/restaurants?lat=${lat}&long=${long}`);
  }

  const fetchOptions = () => {
    return axios.get(`/restaurants/options`);
  }

  const menu = (
    <Menu>
      {sortOptions.map((so, i) => (
        <Menu.Item>
          {so}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="wrapper scrollable">
      <div className="container">
        {
          props._loading ? <Loader /> : (
            <>
              {loading ? (
                <Carousel autoplay>
                  <Loader />
                </Carousel>
              ) : (
                  <>
                    <Carousel autoplay>
                      {advts.map(advt => (
                        <div key={advt._id}>
                          <img src={advt.response.url} />
                        </div>
                      ))}
                    </Carousel>

                    <Row gutter={16}>
                      <Col span={6}>
                        <div style={{ marginBottom: 16 }}>
                          <Card>
                            <div className="space-between-center" >
                              <span>24 Open {!timeVisibility && "Currently"}</span>
                              <Button type="link" onClick={() => setTimeVisibility(true)}>Change Time</Button>
                            </div>
                            {timeVisibility && (
                              <div style={{ marginTop: 16 }} className="space-between-center" >
                                <TimePicker format="hh:mm A" value={!!time ? moment(time, "hh:mm A") : undefined} onChange={value => setTime(value.format("hh:mm A"))} />
                                <Button type="link" onClick={() => { setTime(undefined); setTimeVisibility(false); }}>Reset</Button>
                              </div>
                            )}
                          </Card>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <Card>
                            <div className="space-between-center" >
                              {["Veg", "Non Veg", "Both"].map((type, i) => (
                                <Button style={{ padding: 0 }} key={`food-type-${i + 1}`} className={type == selectedFoodType ? "selected-food-type" : undefined} onClick={() => setSelectedFoodType(type)} type="link">{type}</Button>
                              ))}
                            </div>
                          </Card>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          {!!options && <CategoryView categories={options.categories} />}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <CostForOneView />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <MoreFiltersView dataSource={moreFilters} />
                        </div>
                      </Col>
                      <Col span={18}>
                        <div className="inline-form">
                          <Input.Search placeholder="Search restaurants or dishes" size="large" />
                          <Button size="large" icon="environment">Map View</Button>
                          <Dropdown trigger={["click"]} overlay={menu}>
                            <Button size="large" icon="sort-descending">Sorting Options</Button>
                          </Dropdown>
                        </div>
                        {/* <Row type="flex" gutter={16}>
                          <Col span={10}><Input.Search placeholder="Search restaurants or dishes" style={{width: "100%"}} size="large" /> </Col>
                          <Col><Button size="large" icon="environment">Map View</Button></Col>
                          <Col><Button size="large" icon="sort-descending">Sorting Options</Button></Col>
                        </Row> */}
                      </Col>
                    </Row>
                  </>
                )}
            </>
          )
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Home);