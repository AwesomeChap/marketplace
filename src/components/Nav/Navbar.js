import React, {useState, useEffect} from 'react';
import { Icon, Input } from 'antd';
import { NavLink, Link } from 'react-router-dom';
import '../../scss/nav.scss';
import SubNav from './SubNav';

const Navbar = (props) => {

  const [data, setData] = useState([]);
  const [addrInput, setAddrInput] = useState();

  // useEffect(() => {
  //   setLoading(true);
  //   let encodedText = encodeURIComponent(getFieldValue("address"));
  //   if (encodedText === "undefined") encodedText = "";
  //   axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedText}.json?access_token=pk.eyJ1IjoiYXdlc29tZWNoYXAiLCJhIjoiY2p6NGxuYzV4MDM0NjNmdDQxNm5vd3RlZiJ9.fnHf3fB5ddaANEfKiqYrAQ&cachebuster=1565433849624&autocomplete=true`)
  //     .then(({ data }) => {
  //       if (data.features) {
  //         setData(data.features);
  //         // console.log(data.features);
  //       } else {
  //         setData([]);
  //       }
  //       setTimeout(() => setLoading(false), 1000);
  //     })
  //     .catch(e => {
  //       setLoading(false);
  //       setData([]);
  //     });
  // }, addrInput);


  return (
    <div className="nav wrapper primary">
      <div className="container">
        <div className="space-between">
          <div className="left-sub-nav"><Link className="big link" to="/" > <Icon type="environment" style={{opacity: "0.5"}} /> </Link> <Input placeholder="Your location"/> </div>
          <SubNav dashboardPath={props.dashboardPath} />
        </div>
      </div>
    </div>
  )
}

export default Navbar;