import React, { useEffect, useState, useRef } from 'react';
import {
  Carousel, Row, Col, TimePicker, Card,
  Input, Select, Button, Menu, Dropdown, Radio,
  Badge, Tag, Affix, Icon, Tooltip
} from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { setFilterOptions } from '../../redux/actions/actions';
import axios from 'axios';
import Loader from '../Helper/Loader';
import CategoryView from '../Helper/GenericCategoryView';
import CostForOneView from './HomeSubComp/CostForOne';
import MoreFiltersView from './HomeSubComp/MoreFilters';
import _ from 'lodash';
import Restaurants from './HomeSubComp/Restaurants';
import ScrollToTop from '../Helper/ScrollToTop';
import "./../../scss/home.scss";
import MapView from './HomeSubComp/MapView';
import { iconFontCNUrl } from '../../keys';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFontCNUrl,
});

const getOptions = (arr, key) => {
  let resArr = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i][key].length; j++) {
      if (!resArr.includes(arr[i][key][j])) {
        resArr.push(arr[i][key][j])
      }
    }
  }

  return resArr.sort();
}

const Home = (props) => {

  console.log(`home props`, props);

  const [advts, setAdvts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRsts, setFilteredRsts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [timeVisibility, setTimeVisibility] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hideClosed, setHideClosed] = useState(false);
  const [sortOptions, setSortingOptions] = useState(["Distance", "Cost For One", "Rating"]);
  const [searchText, setSearchText] = useState("");
  const [searchOption, setSearchOption] = useState("restaurants");

  const moreFilterOptions = ["Dining In", "Take Away", "Delivery", "Special Offers", "Alcohol Served", "Alcohol Not Allowed", "Smoking Not Allowed "]
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
          // setFilteredRsts(resRestaurants.data.restaurants.filter(rst => !(moment().isBefore(moment(rst.openingTime, "hh:mm A")) || moment().isAfter(moment(rst.closingTime, "hh:mm A")))));
          setAdvts([].concat.apply([], resAdvts.data.advts));
          setOptions({ ...resOptions.data.options, flavours: getOptions(resRestaurants.data.restaurants, "flavours"), ingredients: getOptions(resRestaurants.data.restaurants, "ingredients"), nutrients: getOptions(resRestaurants.data.restaurants, "nutrients") });
          setLoading(false);
        })).catch(e => setLoading(false))
    }
  }, [props.location]);

  useEffect(() => {
    console.log(options);
  }, [options])

  useEffect(() => {
    setSearchText("");
  }, [searchOption])

  // filtering
  useEffect(() => {
    // let rsts = [...filteredRsts];
    let rsts = [...restaurants];

    if (hideClosed) {
      if (!!props.filterOptions && !!props.filterOptions.time) {
        rsts = rsts.filter(rst => !(moment(props.filterOptions.time, "hh:mm A").isBefore(moment(rst.openingTime, "hh:mm A")) || moment(props.filterOptions.time, "hh:mm A").isAfter(moment(rst.closingTime, "hh:mm A"))) && !rst.closingDays.includes(moment().format('dddd')))
      }
      else {
        rsts = rsts.filter(rst => !(moment().isBefore(moment(rst.openingTime, "hh:mm A")) || moment().isAfter(moment(rst.closingTime, "hh:mm A"))) && !rst.closingDays.includes(moment().format('dddd')))
      }
    }

    if (!!searchText && searchText.replace(/\s/g, '').length) {
      console.log("It entered here!");

      if (searchOption === "restaurants") {
        rsts = [...rsts].filter(rst => _.toLower(rst.restaurantName).includes(_.toLower(searchText)));
      }

      else {
        rsts = [...rsts].filter(rst => {
          let dishes = rst.dishes.filter(dish => {
            return _.toLower(dish).includes(_.toLower(searchText));
          })

          return !!dishes.length
        })
      }
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

    // ingredients
    if (props.filterOptions.ingredients.length) {
      rsts = rsts.filter(rst => {
        let ing;
        for (ing of props.filterOptions.ingredients) {
          if (!rst.ingredients.includes(ing)) return false;
        }
        return true;
      })
    }

    // nutrients
    if (props.filterOptions.nutrients.length) {
      rsts = rsts.filter(rst => {
        let nut;
        for (nut of props.filterOptions.nutrients) {
          if (!rst.nutrients.includes(nut)) return false;
        }
        return true;
      })
    }

    // flavours
    if (props.filterOptions.flavours.length) {
      rsts = rsts.filter(rst => {
        let flav;
        for (flav of props.filterOptions.flavours) {
          if (!rst.flavours.includes(flav)) return false;
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
        setSortingOptions(["Distance", "Cost For One", "Rating", "Min Order"]);
        rsts = rsts.filter(rst => rst.serviceOptions.includes("Delivery"));
      }
      else {
        setSortingOptions(["Distance", "Cost For One", "Rating"]);
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
        case 'Distance': break;
        case 'Min Order': rsts.sort(compareMinSort); break;
        case 'Cost For One': rsts.sort(compareCostForOne); break;
        case 'Rating': rsts.sort(compareRating); break;
        default: break;
      }
    } 

    setFilteredRsts(rsts);
  }, [props.filterOptions, hideClosed, searchText]);

  const searchBefore = (
    <Button.Group>
      <Tooltip title="Restaurants"><Button onClick={() => setSearchOption("restaurants")} style={{ fontSize: 18, color: searchOption !== "restaurants" && "#aaa" }} type="link"><Icon type="shop" /></Button></Tooltip>
      <Tooltip title="Dishes"><Button onClick={() => setSearchOption("dishes")} style={{ fontSize: 18, color: searchOption !== "dishes" && "#aaa" }} type="link"><IconFont type="icon-FoodDrink" /></Button></Tooltip>
    </Button.Group>
  );

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
      if (!(moment(!!props.filterOptions && !!props.filterOptions.time ? props.filterOptions.time : moment().format("hh:mm A"), "hh:mm A").isBefore(moment(rst.openingTime, "hh:mm A")) || moment(!!props.filterOptions && !!props.filterOptions.time ? props.filterOptions.time : moment().format("hh:mm A"), "hh:mm A").isAfter(moment(rst.closingTime, "hh:mm A"))) && !rst.closingDays.includes(moment().format('dddd'))) {
        openRsts++
        rst["status"] = true;
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
                              <b>Found {restaurants.length} restaurants.</b>
                              <Badge dot={hideClosed}><Button size="small" onClick={() => setHideClosed(!hideClosed)}>Hide Closed</Button></Badge>
                            </div>
                            <div style={{ marginTop: 16 }} className="space-between-center" >
                              <span><Badge style={{ backgroundColor: !!getOpenRsts() && "#52c41a" }} showZero={true} count={getOpenRsts()}> <Tag color="green">Open</Tag> </Badge> </span>
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
                          {!!options && <CategoryView name="Categories" categories={props.filterOptions.categories} handleChange={(values) => props.setFilterOptions({ ...props.filterOptions, categories: values })} dataSource={options.categories} />}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          {!!options && <CategoryView name="Flavours" categories={props.filterOptions.flavours} handleChange={(values) => props.setFilterOptions({ ...props.filterOptions, flavours: values })} dataSource={{ main: options.flavours.slice(0, 8), all: options.flavours }} />}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          {!!options && <CategoryView name="Ingredients" categories={props.filterOptions.ingredients} handleChange={(values) => props.setFilterOptions({ ...props.filterOptions, ingredients: values })} dataSource={{ main: options.ingredients.slice(0, 8), all: options.ingredients }} />}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          {!!options && <CategoryView name="Nutrients" categories={props.filterOptions.nutrients} handleChange={(values) => props.setFilterOptions({ ...props.filterOptions, nutrients: values })} dataSource={{ main: options.nutrients.slice(0, 8), all: options.nutrients }} />}
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
                                <Input.Search onSearch={value => setSearchText(value)} placeholder="Search restaurants" size="large" />
                                {/* <Button size="large" icon="environment" onClick={() => setMapView(!mapView)} >Map View</Button> */}
                                <Button size="large" onClick={() => setMapView(!mapView)}><IconFont type="icon-realtimelocation" /> Map View</Button>
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
                                {/* <Input.Search allowClear={true} size="large" placeholder="Search restaurants" /> */}
                                <Input addonBefore={searchBefore} onChange={({ target: { value } }) => setSearchText(value)} addonAfter={<Icon type="search" />} placeholder={`Search ${searchOption}`} size="large" />
                                {/* <Button size="large" icon="environment" onClick={() => { setMapView(!mapView); setOffset(0) }} >Map View</Button> */}
                                <Button size="large" onClick={() => { setMapView(!mapView); setOffset(0) }}><IconFont type="icon-realtimelocation" /> Map View</Button>
                                <Dropdown trigger={["click"]} overlay={menu} getPopupContainer={() => document.querySelector(".wrapper.scrollable")}>
                                  <Button size="large" icon="sort-descending">Sorting Options</Button>
                                </Dropdown>
                              </div>
                              <Restaurants searchText={searchText} {...props} searchOption={searchOption} filterOptions={props.filterOptions} restaurants={filteredRsts} />
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