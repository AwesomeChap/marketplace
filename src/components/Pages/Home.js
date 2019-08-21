import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col, TimePicker, Card, Input, Button, Menu, Dropdown, Radio, Badge, Tag } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { setFilterOptions } from '../../redux/actions/actions';
import axios from 'axios';
import Loader from '../Helper/Loader';
import CategoryView from './HomeSubComp/CategoryView';
import CostForOneView from './HomeSubComp/CostForOne';
import MoreFiltersView from './HomeSubComp/MoreFilters';
import _ from 'lodash';
import Restaurants from './UserDashboard/Restaurants';

const Home = (props) => {

  const [advts, setAdvts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [time, setTime] = useState(null);
  const [timeVisibility, setTimeVisibility] = useState(false);
  const [selectedFoodType, setSelectedFoodType] = useState("Both");
  const [selectedSortingOption, setSelectedSortingOption] = useState("Distance");

  const moreFilterOptions = ["Dining In", "Take Away", "Delivery", "Special Offers", "Alcohol served", "Alcohol Not Allowed", "Smoking Not Allowed "]
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

  useEffect(() => console.log(selectedSortingOption), [selectedSortingOption]);

  const fetchAdvts = (lat, long) => {
    return axios.get(`/advertisement/show?lat=${lat}&long=${long}`)
  }

  const fetchRestaurants = (lat, long) => {
    return axios.get(`/restaurants?lat=${lat}&long=${long}`);
  }

  const fetchOptions = () => {
    return axios.get(`/restaurants/options`);
  }

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    padding: "0px 16px",
  };

  const menu = (
    <Menu>
      <Radio.Group value={props.filterOptions.sortingOption} onChange={({ target: { value } }) => props.setFilterOptions({ ...props.filterOptions, sortingOption: value })}>
        {sortOptions.map((so, i) => (
          <Radio style={radioStyle} key={so + i} value={so}>{so}</Radio>
        ))}
      </Radio.Group>
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
                              <span><Badge showZero={true} count={restaurants.length}> <Tag color="green">Open</Tag> </Badge> </span>
                              <span>{!timeVisibility && "Currently"}</span>
                              <Button style={{ padding: 0 }} type="link" onClick={() => setTimeVisibility(true)}>Change Time</Button>
                            </div>
                            {timeVisibility && (
                              <div style={{ marginTop: 16 }} className="space-between-center" >
                                <TimePicker getPopupContainer={() => document.querySelector(".wrapper.scrollable")} format="hh:mm A" value={!!props.filterOptions.time ? moment(props.filterOptions.time, "hh:mm A") : undefined} onChange={value => props.setFilterOptions({ ...props.filterOptions, time: value.format("hh:mm A") })} />
                                <Button style={{ padding: 0 }} type="link" onClick={() => { props.setFilterOptions({ ...props.filterOptions, time: undefined }); setTimeVisibility(false); }}>Reset</Button>
                              </div>
                            )}
                          </Card>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <Card>
                            <div className="space-between-center" >
                              {["Veg", "Non Veg", "Both"].map((type, i) => (
                                <Button style={{ padding: 0 }} key={`food-type-${i + 1}`} className={type === props.filterOptions.foodType ? "selected-food-type" : undefined} onClick={() => props.setFilterOptions({ ...props.filterOptions, foodType: type })} type="link">{type}</Button>
                              ))}
                            </div>
                          </Card>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          {!!options && <CategoryView categories={props.filterOptions.categories} handleChange={(values) => props.setFilterOptions({ ...props.filterOptions, categories: values })} dataSource={options.categories} />}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <CostForOneView costForOne={props.filterOptions.costForOne} handleChange={(value) => props.setFilterOptions({ ...props.filterOptions, costForOne: value })} />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <MoreFiltersView moreFilters={props.filterOptions.moreFilters} handleChange={(values) => props.setFilterOptions({ ...props.filterOptions, moreFilters: values })} dataSource={moreFilterOptions} />
                        </div>
                      </Col>
                      <Col span={18}>
                        <div style={{ marginBottom: 16 }} className="inline-form">
                          <Input.Search placeholder="Search restaurants or dishes" size="large" />
                          <Button size="large" icon="environment">Map View</Button>
                          <Dropdown trigger={["click"]} overlay={menu} getPopupContainer={() => document.querySelector(".wrapper.scrollable")}>
                            <Button size="large" icon="sort-descending">Sorting Options</Button>
                          </Dropdown>
                        </div>
                        <Restaurants filterOptions={props.filterOptions} restaurants={restaurants}/>
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

export default connect(mapStateToProps, { setFilterOptions })(Home);

/*
{
  time: undefined,
  foodType: "Both",
  categories: [],
  costForOne: undefined,
  moreFilters: [],
  sortingOption: "Distance"
}
*/