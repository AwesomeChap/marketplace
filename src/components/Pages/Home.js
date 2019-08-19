import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col, Affix } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import Loader from '../Helper/Loader';

const Home = (props) => {

  const [advts, setAdvts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!!props.location) {
      setLoading(true);
      axios.all([
        fetchAdvts(props.location.geometry.latitude, props.location.geometry.longitude), 
        fetchRestaurants(props.location.geometry.latitude, props.location.geometry.longitude),
        fetchOptions(),
      ])
        .then(axios.spread((resAdvts, resRestaurants, resOptions) => {
          setRestaurants(resRestaurants.data.restaurants);
          setAdvts([].concat.apply([], resAdvts.data.advts));
          setOptions(resOptions.categories);
          setLoading(false);
        })).catch(e => setLoading(false))
    }
  }, [props.location]);

  useEffect(() => console.log(restaurants), [restaurants]);

  const fetchAdvts = (lat, long) => {
    return axios.get(`/advertisement/show?lat=${lat}&long=${long}`)
  }

  const fetchRestaurants = (lat, long) => {
    return axios.get(`/restaurants?lat=${lat}&long=${long}`);
  }

  const fetchOptions = () => {
    return axios.get(`/restaurants/options`);
  }

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
                  <Carousel autoplay>
                    {advts.map(advt => (
                      <div key={advt._id}>
                        <img src={advt.response.url} />
                      </div>
                    ))}
                  </Carousel>
                )}
            </>
          )
        }
        <Row gutter={16}>
          <Col span={6}>
            <div className="grey-bg">
              
            </div>
          </Col>
          <Col span={18}>
            <div className="grey-bg">col-18</div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Home);