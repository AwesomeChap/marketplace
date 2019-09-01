import React, { useEffect, useState, useRef } from 'react';
import { Carousel, Row, Col, TimePicker, Card, Input, Button, Menu, Dropdown, Radio, Badge, Tag, Affix } from 'antd';
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
import ScrollToTop from '../Helper/ScrollToTop';

import "./../../scss/home.scss"
import MapView from './UserDashboard/mapView';

const Home = (props) => {

  const [advts, setAdvts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRsts, setFilteredRsts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [timeVisibility, setTimeVisibility] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const moreFilterOptions = ["Dining In", "Take Away", "Delivery", "Special Offers", "Alcohol Served", "Alcohol Not Allowed", "Smoking Not Allowed "]
  const sortOptions = ["Distance", "Min Order", "Cost for one", "Rating"];
  let wrapperRef = useRef(null);

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
          setFilteredRsts(resRestaurants.data.restaurants);
          setAdvts([].concat.apply([], resAdvts.data.advts));
          setOptions(resOptions.data.options);
          setLoading(false);
        })).catch(e => setLoading(false))
    }
  }, [props.location]);

  // filtering
  useEffect(() => {
    let rsts = [...restaurants];

    // time - show only opened
    if (!!props.filterOptions.time && !showAll) {
      rsts = rsts.filter(rst => !(moment(!!props.filterOptions && !!props.filterOptions.time ? props.filterOptions.time : moment().format("hh:mm A"), "hh:mm A").isBefore(moment(rst.openingTime, "hh:mm A")) || moment(!!props.filterOptions && !!props.filterOptions.time ? props.filterOptions.time : moment().format("hh:mm A"), "hh:mm A").isAfter(moment(rst.closingTime, "hh:mm A"))))
    }

    // foodType - veg, non-veg, both
    if (!!props.filterOptions.foodType) {
      rsts = rsts.filter(rst => {
        switch (props.filterOptions.foodType) {
          case "Veg": return rst.foodType.includes("Veg") && rst.foodType.length === 1;
          case "Non Veg": return rst.foodType.includes("Non Veg") && rst.foodType.length === 1;
          case "Both": return true;
          default: return true;
        }
      })
    }

    // categories / sub-categories
    if (props.filterOptions.categories.length) {
      rsts = rsts.filter(rst => {
        let cat;
        for (cat of props.filterOptions.categories) {
          if (!rst.categories.includes(cat)) return false;
        }
        return true;
      })
    }

    // cost for one
    if (!!props.filterOptions.costForOne) {
      rsts = rsts.filter(rst => (rst.costForOne >= props.filterOptions.costForOne.min && rst.costForOne <= props.filterOptions.costForOne.max) || (props.filterOptions.costForOne.max === undefined && rst.costForOne > props.filterOptions.costForOne.min))
    }

    // more filters
    if (props.filterOptions.moreFilters.length) {

      // dining in
      if (props.filterOptions.moreFilters.includes("Dining In")) {
        rsts = rsts.filter(rst => rst.serviceOptions.includes("Dining In"));
      }

      // take away
      if (props.filterOptions.moreFilters.includes("Take Away")) {
        rsts = rsts.filter(rst => rst.serviceOptions.includes("Take Away"));
      }

      // delivery
      if (props.filterOptions.moreFilters.includes("Delivery")) {
        rsts = rsts.filter(rst => rst.serviceOptions.includes("Delivery"));
      }

      //Special Offers 
      if (props.filterOptions.moreFilters.includes("Special Offers")) {
        rsts = rsts.filter(rst => !!rst.discount);
      }

      //Alcohol served
      if (props.filterOptions.moreFilters.includes("Alcohol Served")) {
        rsts = rsts.filter(rst => rst.alcohol.served);
      }

      //Alcohol Not Allowed 
      if (props.filterOptions.moreFilters.includes("Alcohol Not Allowed")) {
        rsts = rsts.filter(rst => !rst.alcohol.allowed);
      }

      //Smoking Not Allowed
      if (props.filterOptions.moreFilters.includes("Smoking Not Allowed")) {
        rsts = rsts.filter(rst => !rst.smoking.allowed);
      }
    }

    function compareMinSort(a, b) {
      if (a.minOrder < b.minOrder) {
        return -1;
      }
      if (a.minOrder > b.minOrder) {
        return 1;
      }
      return 0;
    }

    function compareCostForOne(a, b) {
      if (a.costForOne < b.costForOne) {
        return -1;
      }
      if (a.costForOne > b.costForOne) {
        return 1;
      }
      return 0;
    }

    function compareRating(a, b) {
      if (a.rating < b.rating) {
        return 1;
      }
      if (a.rating > b.rating) {
        return -1;
      }
      return 0;
    }

    // sorting options { default: distance }
    if (props.filterOptions.sortingOption) {
      switch (props.filterOptions.sortingOption) {
        case 'Distance': rsts = restaurants; break;
        case 'Min Order': rsts.sort(compareMinSort); break;
        case 'Cost For One': rsts.sort(compareCostForOne); break;
        case 'Rating': rsts.sort(compareRating); break;
        default: rsts = restaurants; break;
      }
    }

    if(!props.filterOptions.time){
      console.log("here"); 
      rsts = rsts.filter( rst => false);
      console.log(rsts);
    }

    setFilteredRsts(rsts);
  }, [props.filterOptions, showAll]);

  // useEffect(() => console.log(mapView), [mapView]);

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

  const getOpenRsts = () => {
    let openRsts = 0;
    let rst;
    for (rst of restaurants) {
      if (!(moment(!!props.filterOptions && !!props.filterOptions.time ? props.filterOptions.time : moment().format("hh:mm A"), "hh:mm A").isBefore(moment(rst.openingTime, "hh:mm A")) || moment(!!props.filterOptions && !!props.filterOptions.time ? props.filterOptions.time : moment().format("hh:mm A"), "hh:mm A").isAfter(moment(rst.closingTime, "hh:mm A")))) {
        openRsts++
        rst["status"] = true;
        // console.log(openRsts);
      }
      else rst["status"] = false;
    }

    return openRsts;
  }

  return (
    <div ref={(node) => wrapperRef = node} className="wrapper scrollable">
      {wrapperRef != null && <ScrollToTop getCurrentRef={() => wrapperRef} />}
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

                    <Row style={{ position: "relative" }} gutter={16}>
                      <Col span={6}>
                        <div style={{ marginBottom: 16 }}>
                          <Card>
                            <div className="space-between-center" >
                              <span><Badge style={{ backgroundColor: !!getOpenRsts() && "#52c41a" }} showZero={true} count={getOpenRsts()}> <Tag color="green">Open</Tag> </Badge> </span>
                              <Badge dot={showAll}><Button size="small" onClick={() => setShowAll(!showAll)}>Show All</Button></Badge>
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
                      <>
                        {mapView ? (
                          <Affix offsetTop={16} target={() => document.querySelector(".wrapper.scrollable")} onChange={affixed => setOffset(affixed ? 6 : 0)}>
                            <Col span={18} offset={offset}>
                              <div style={{ marginBottom: 16 }} className="inline-form">
                                <Input.Search placeholder="Search restaurants or dishes" size="large" />
                                <Button size="large" icon="environment" onClick={() => setMapView(!mapView)} >Map View</Button>
                                <Dropdown trigger={["click"]} overlay={menu} getPopupContainer={() => document.querySelector(".wrapper.scrollable")}>
                                  <Button size="large" icon="sort-descending">Sorting Options</Button>
                                </Dropdown>
                              </div>
                              <MapView filterOptions={props.filterOptions} restaurants={filteredRsts} />
                            </Col>
                          </Affix>
                        ) : (
                            <Col span={18}>
                              <div style={{ marginBottom: 16 }} className="inline-form">
                                <Input.Search placeholder="Search restaurants or dishes" size="large" />
                                <Button size="large" icon="environment" onClick={() => { setMapView(!mapView); setOffset(0) }} >Map View</Button>
                                <Dropdown trigger={["click"]} overlay={menu} getPopupContainer={() => document.querySelector(".wrapper.scrollable")}>
                                  <Button size="large" icon="sort-descending">Sorting Options</Button>
                                </Dropdown>
                              </div>
                              <Restaurants filterOptions={props.filterOptions} restaurants={filteredRsts} />
                            </Col>
                          )}
                      </>
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