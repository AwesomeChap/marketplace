import React, { useState, useEffect, useRef } from 'react';
import { Menu, Icon, message } from 'antd';
import PaymentConfig from '../AdminDashboardTabs/PaymentConfig';
import VerifyEmailConfig from '../AdminDashboardTabs/VerifyEmailConfig';
import CreateRootCategory from '../AdminDashboardTabs/CreateRootCategory';
import Loader from '../../Helper/Loader';
import axios from 'axios';
import { connect } from 'react-redux';
import { setConfig, updateCategoriesConfig } from '../../../redux/actions/actions';
import OtherFieldsTable from '../AdminDashboardTabs/OtherFieldsTable';
import NestedFieldsTable from '../AdminDashboardTabs/NestedFieldsTable';
import QueueAnim from 'rc-queue-anim';
import ScrollToTop from '../../Helper/ScrollToTop';

const AdminDashboard = (props) => {

  const [tabIndex, setTabIndex] = useState("sub1");
  let wrapperRef = useRef(null);

  const handleClick = e => {
    console.log(e.key);
    if (e.key) {
      setTabIndex(e.key);
    }
  };

  useEffect(() => {
    axios.get(`/config?userId=${props.user._id}`).then(({ data }) => {
      props.setConfig(data.config);
      if (data.type == "info") {
        return message.info(data.message);
      }
      // return message.success(data.message)
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response));
      if(error.status == "403") props.history.push('/'); 
      return message.error(error.data.message);
    })
  }, [])

  useEffect(() => {
    if (tabIndex == "sub2" && window.location.hash.split("#")[1] > props.config.categories.values.length)
      window.location.hash = "#1";
  }, [tabIndex])

  if (!props.config) {
    return <Loader />
  }

  const setTabIndexMenu = (key, i, name) => {
    setTabIndex(key)
    window.location.hash = `#${i}`;
  };

  const keys = ["sub1", "ingredients", "flavours", "nutrition", "spices", "allergy", "priceRange", "time", "foodProvider",
    "commission", "order", "complain", "advertisement", "customer", "courier", "mailConfig", "payment"]

  const tabs = {
    "sub1": <CreateRootCategory key="sub1" setTabIndexMenu={setTabIndexMenu} user={props.user} />,
    "ingredients": <OtherFieldsTable key="ingredients" name="ingredients" user={props.user} />,
    "flavours": <OtherFieldsTable key="flavours" name="flavours" user={props.user} />,
    "nutrition": <OtherFieldsTable key="nutrition" name="nutrition" user={props.user} />,
    "spices": <OtherFieldsTable key="spices" name="spices" user={props.user} />,
    "allergy": <OtherFieldsTable key="allergy" name="allergy" user={props.user} />,
    "priceRange": <OtherFieldsTable key="priceRange" name="priceRange" user={props.user} />,
    "time": <OtherFieldsTable key="time" name="time" user={props.user} />,
    "foodProvider": <OtherFieldsTable key="foodProvider" name="foodProvider" user={props.user} />,
    "commission": <OtherFieldsTable key="commission" name="commission" user={props.user} />,
    "order": <OtherFieldsTable key="order" name="order" user={props.user} />,
    "complain": <OtherFieldsTable key="complain" name="complain" user={props.user} />,
    "advertisement": <NestedFieldsTable key="advertisment" rootName="advertisement" user={props.user} />,
    "customer": <OtherFieldsTable key="customer" name="customer" user={props.user} />,
    "courier": <NestedFieldsTable key="courier" rootName="courier" user={props.user} />,
    "mailConfig": <VerifyEmailConfig key="mailConfig" user={props.user} />,
    "payment": <PaymentConfig key="payment" user={props.user} />,
  }


  const { values } = props.config.categories;
  return (
    <div className="wrapper">
      <>
        <div style={{ width: 320 }} className="scrollable wrapper">
          <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} openKeys={[tabIndex]} mode="inline">
            <Menu.Item onClick={handleClick} key="sub1"><Icon type="apartment" />Manage Root Categories</Menu.Item>
            {/* <SubMenu key="sub2" onTitleClick={handleClick} title={<span><Icon type="appstore" /><span>Categories</span></span>}>
              {values.map((val, i) => (
                <Menu.Item key={`${val}-${i}`}>
                  <a href={`#${i + 1}`} rel="noopener noreferrer"><Icon type="setting" />{val}</a>
                </Menu.Item>
              ))}
            </SubMenu> */}
            <Menu.Item onClick={handleClick} key="ingredients"><Icon type="appstore" />Ingredients</Menu.Item>
            <Menu.Item onClick={handleClick} key="flavours"><Icon type="appstore" />Flavours</Menu.Item>
            <Menu.Item onClick={handleClick} key="nutrition"><Icon type="appstore" />Nutrition</Menu.Item>
            <Menu.Item onClick={handleClick} key="spices"><Icon type="appstore" />Spice Levels</Menu.Item>
            <Menu.Item onClick={handleClick} key="allergy"><Icon type="appstore" />Allergy</Menu.Item>
            <Menu.Item onClick={handleClick} key="priceRange"><Icon type="appstore" />Price Range</Menu.Item>
            <Menu.Item onClick={handleClick} key="time"><Icon type="appstore" />Serve Time</Menu.Item>
            <Menu.Item onClick={handleClick} key="foodProvider"><Icon type="shop" />Food Provider</Menu.Item>
            <Menu.Item onClick={handleClick} key="commission"><Icon type="pound" />Commission</Menu.Item>
            <Menu.Item onClick={handleClick} key="payment"><Icon type="credit-card" />Payment</Menu.Item>
            <Menu.Item onClick={handleClick} key="order"><Icon type="container" />Order</Menu.Item>
            <Menu.Item onClick={handleClick} key="advertisement"><Icon type="global" />Advertisement</Menu.Item>
            <Menu.Item onClick={handleClick} key="customer"><Icon type="team" />Customer</Menu.Item>
            <Menu.Item onClick={handleClick} key="courier"><Icon type="red-envelope" />Courier</Menu.Item>
            <Menu.Item onClick={handleClick} key="mailConfig"><Icon type="mail" />SMTP Config</Menu.Item>
          </Menu>
        </div>
        <div ref={(node) => wrapperRef = node} className="scrollable wrapper">
          {wrapperRef != null && <ScrollToTop getCurrentRef={() => wrapperRef}/>}
          <div className="container">
            {
              keys.map((key) => {
                return <QueueAnim
                  key={`${key}-tab`} 
                  delay={tabIndex == key ? 300 : 0}
                  duration={400}
                  ease={"easeOutCirc"}
                  animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] },
                    { opacity: [1, 0], translateY: [0, -50] }
                  ]}
                >
                  {tabIndex == key ? [tabs[key]] : [null]}
                </QueueAnim>
              })
            }
          </div>
        </div>
      </>
    </div>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setConfig, updateCategoriesConfig })(AdminDashboard);