import React, { useState, useEffect } from 'react';
import { Icon, Input, AutoComplete, Form, Button, Tooltip } from 'antd';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { setLocation, _setLoading } from '../../redux/actions/actions';
import { connect } from 'react-redux';
import '../../scss/nav.scss';
import SubNav from './SubNav';
import axios from 'axios';
import { mapBoxKey, iconFontCNUrl } from '../../keys';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFontCNUrl,
});

const Navbar = (props) => {

  const [data, setData] = useState([]);
  const [location, setLocation] = useState();

  useEffect(() => {
    // console.log(props.history);
    _locateMe();
  }, [])

  const _locateMe = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      const encodedText = encodeURIComponent(`${long},${lat}`);
      props._setLoading(true);
      axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedText}.json?access_token=${mapBoxKey}&cachebuster=1565433849624&autocomplete=true`)
        .then(({ data }) => {
          if (data.features) {
            let d = data.features[0];
            props.setLocation({
              id: d.id,
              name: d.text,
              address: d.place_name,
              geometry: {
                longitude: d.geometry.coordinates[0],
                latitude: d.geometry.coordinates[1]
              }
            });
            setLocation(data.features[0].place_name);
            setData(data.features);
            props._setLoading(false);
          } else {
            setData([]);
            props._setLoading(false);
          }
        })
        .catch(e => {
          setData([]);
          props._setLoading(false);
        });
    });
  }

  const handleSearch = (value) => {
    setLocation(value);
    let encodedText = encodeURIComponent(value);
    if (encodedText === "undefined") encodedText = "";
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedText}.json?access_token=${mapBoxKey}&cachebuster=1565433849624&autocomplete=true`)
      .then(({ data }) => {
        if (data.features) {
          setData(data.features);
        } else {
          setData([]);
        }
      })
      .catch(e => {
        setData([]);
      });
  }

  const addressOptions = data.length ? data.map(d => (
    <AutoComplete.Option key={d.id} label={d.text} value={d.place_name} style={{ whiteSpace: "normal" }} fullAddr={{
      id: d.id,
      name: d.text,
      address: d.place_name,
      geometry: {
        longitude: d.geometry.coordinates[0],
        latitude: d.geometry.coordinates[1]
      }
    }}
    >
      <h3>{d.text}</h3>
      <p>{d.place_name}</p>
    </AutoComplete.Option>
  )) : null;

  const onSelect = (value, option) => {
    console.log(option.props.fullAddr);
    props.setLocation(option.props.fullAddr);
    setLocation(value);
  };

  return (
    <div className="nav wrapper primary">
      <div className="container">
        <div className="space-between">
          <div className="left-sub-nav">
            <Link className="big link" to="/" ><Icon type="environment" style={{ opacity: "0.5" }} /></Link>
            {props.history.location.pathname == "/" && (
              <>
                <AutoComplete value={location} onSearch={handleSearch} style={{ width: "100%" }} dataSource={addressOptions} placeholder="Please input an address" onSelect={onSelect} optionLabelProp="value">
                  <Input allowClear={true} />
                </AutoComplete>
                <Tooltip placement="bottom" title="Find me">
                  <Button shape="round" onClick={_locateMe} style={{ padding: "0 8px", fontSize: 18 }} type="primary">
                    <IconFont type="icon-location1" />
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
          <SubNav dashboardPath={props.dashboardPath} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setLocation, _setLoading })(withRouter(Navbar));