import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { message, Row, Col } from 'antd';
import { setRestaurant } from '../../../redux/actions/actions';
import Loader from '../../Helper/Loader';
import RestaurantTopBar from './RestaurantSubComp/RestaurantTopBar';
import RestaurantFilters from './RestaurantSubComp/RestaurantFilters';
import RestaurantDishes from './RestaurantSubComp/RestaurantDishes';
import RestaurantOrders from './RestaurantSubComp/RestaurantOrders';

const RestaurantOnline = (props) => {
  const [loading, setLoading] = useState(false);
  const [shrinkTopBar, setShrinkToBar] = useState(false);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    foodType: "Both",
    spiceLevel: {
      value: undefined,
      options: []
    },
    categories: {
      values: [],
      options: {
        main: [],
        all: []
      }
    }
  })

  useEffect(() => {
    setLoading(true);
    axios.get(`/restaurants/online/${props.match.params.sellerId}/${props.match.params.branchId}`).then(({ data }) => {
      props.setRestaurant(data);
      let fo = {
        ...filterOptions,
        categories: { value: [], options: data.categories },
        spiceLevel: { value: undefined, options: data.spiceLevels }
      }
      setFilterOptions(fo); setFilteredDishes(data.dishes);
      setLoading(false);
    }).catch(e => { setLoading(false); return message.error("Some error occured") });
  }, [])

  useEffect(() => {
    console.log("filterOptions", filterOptions);
  }, [filterOptions])

  const dss = {
    height: "200vh",
    width: "100%",
    backgroundColor: "#ddd"
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop > 0) {
      setShrinkToBar(true);
    }
    else {
      setShrinkToBar(false);
    }
  }

  const handleFilterChange = (values) => {
    setFilterOptions(values);
  }

  const handleDishesChange = () => {

  }

  if (!loading && !!props.restaurant) {
    return (
      <>
        <RestaurantTopBar rst={props.restaurant} shrinkTopBar={shrinkTopBar} />
        <div onScroll={handleScroll} className="scrollable wrapper">
          <div style={{ paddingTop: 16 }} className="container">
            <Row gutter={16}>
              <Col span={6}> <RestaurantFilters handleChange={handleFilterChange} filterOptions={filterOptions} /> </Col>
              <Col span={12}> <RestaurantDishes handleChange={handleDishesChange} dishes={filteredDishes} /> </Col>
              <Col span={6}> <RestaurantOrders /> </Col>
            </Row>
          </div>
        </div>
      </>
    )
  }

  else return <Loader />
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setRestaurant })(RestaurantOnline);