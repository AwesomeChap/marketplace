import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import { connect } from 'react-redux';
import Loader from '../../Helper/Loader';
import { Badge, Icon } from 'antd';

import CityPin from './CityPin';
import CityInfo from './CityInfo';
import { mapBoxKey, GeolocateControl } from '../../../keys';
import { iconFontCNUrl } from '../../../keys';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFontCNUrl,
});

const fullscreenControlStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const navStyle = {
  position: 'absolute',
  top: 36,
  left: 0,
  padding: '10px'
};

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
};

class MapView extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    viewport: {
      width: 100 + "%",
      height: `calc(${100}vh - ${138}px)`,
      latitude: !!this.props.location ? this.props.location.geometry.latitude : 13,
      longitude: !!this.props.location ? this.props.location.geometry.longitude : 77.6,
      zoom: 15,
      bearing: 0,
      pitch: 0
    },
    popupInfo: null
  };

  _updateViewport = (viewport) => {
    console.log(viewport);
    this.setState({ viewport });
  }

  _renderCityMarker = (rst, index) => {
    // console.log(rst.fullAddr.geometry.longitude);

    if (rst) {
      return (
        <Marker
          key={`marker-${index}`}
          longitude={rst.fullAddr.geometry.longitude}
          latitude={rst.fullAddr.geometry.latitude} >
          <IconFont style={{ fontSize: 20, color: "#180033" }} onClick={() => this.setState({ popupInfo: rst })} type="icon-restaurant" />
        </Marker>
      );
    }
  }

  _renderPopup() {
    const { popupInfo } = this.state;

    return popupInfo && (
      <Popup tipSize={5} anchor="bottom"
        longitude={popupInfo.fullAddr.geometry.longitude}
        latitude={popupInfo.fullAddr.geometry.latitude}
        closeOnClick={false}
        onClose={() => this.setState({ popupInfo: null })} >
        <CityInfo info={popupInfo} />
      </Popup>
    );
  }

  render() {

    const { viewport } = this.state;

    return (
      <ReactMapGL
        {...viewport}
        // mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={mapBoxKey} >

        {this.props.restaurants.map(this._renderCityMarker)}

        {this._renderPopup()}

        <div className="fullscreen" style={fullscreenControlStyle}>
          <FullscreenControl />
        </div>
        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._updateViewport} />
        </div>

        <Marker key={`marker-my-location`}
          longitude={!!this.props.location ? this.props.location.geometry.longitude : 77.6}
          latitude={!!this.props.location ? this.props.location.geometry.latitude : 13}>
          <Badge status="processing" />
        </Marker>

      </ReactMapGL>
    );
  }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(MapView);