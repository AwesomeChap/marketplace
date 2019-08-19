import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import Loader from '../Helper/Loader';

const Home = (props) => {

  const [advts, setAdvts] = useState([]);

  useEffect(() => {
    if (!!props.location) {
      fetchAdvts(props.location.geometry.latitude, props.location.geometry.longitude);
      fetchRestaurants(props.location.geometry.latitude, props.location.geometry.longitude);
    }
  }, [props.location]);

  useEffect(() => {
    console.log(advts);
  }, [advts]);

  const fetchAdvts = (lat, long) => {
    axios.get(`/advertisement/show?lat=${lat}&long=${long}`).then(({ data }) => {
      setAdvts([].concat.apply([], data.advts));
    }).catch(e => console.log(e));
  }

  const fetchRestaurants = (lat, long) => {
    axios.get(`/restautants?lat=${lat}&long=${long}`).then(({data}) => {
      console.log(data);
    })
  }

  return (
    <div className="wrapper scrollable">
      <div className="container">
        <Loader loading={!!props.location && !advts}>
          <Carousel autoplay>
            {advts.map(advt => (
              <div>
                <img src={advt.response.url} />
              </div>
            ))}
          </Carousel>
        </Loader>
      </div>
    </div>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Home);