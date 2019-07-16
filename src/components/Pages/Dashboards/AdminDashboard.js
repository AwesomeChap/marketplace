import React, { useState, useEffect } from 'react';
import { Menu, Icon, message } from 'antd';
import VerifyEmailConfig from '../AdminDashboardTabs/VerifyEmailConfig';
import Categories from '../AdminDashboardTabs/Categories';
import CommissionConfig from '../AdminDashboardTabs/GenericTableExample';
import CreateRootCategory from '../AdminDashboardTabs/CreateRootCategory';
import Loader from '../../Helper/Loader';
import axios from 'axios';
import { connect } from 'react-redux';
import { setConfig, updateCategoriesConfig } from '../../../redux/actions/actions';

const { SubMenu } = Menu;

const AdminDashboard = (props) => {

  const [tabIndex, setTabIndex] = useState("sub1");

  const handleClick = e => {
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
      return message.success(data.message)
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      return message.error(error.message);
    })
  }, [])

  if (!props.config) {
    return <Loader />
  }

  const setTabIndexMenu = (key, i) => {
    setTabIndex(key)
    window.location.hash = `#${i}`;
  };

  const tabs = {
    "sub1": <CreateRootCategory setTabIndexMenu={setTabIndexMenu} user={props.user} />,
    "sub2": <Categories categories={props.config.categories} updateCategoriesConfig={props.updateCategoriesConfig} user={props.user} />,
    "sub3": <VerifyEmailConfig user={props.user} />,
    // "sub3": <CategorizationConfig user={props.user} />,
    "sub5": <CommissionConfig user={props.user} />
  }


  const { values } = props.config.categories;

  return (
    <div className="wrapper">
      <>
        <div style={{ width: 320 }} className="scrollable wrapper">
          <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} openKeys={[tabIndex]} mode="inline">
            <Menu.Item onClick={handleClick} key="sub1"><Icon type="apartment" />Create New Category</Menu.Item>
            <SubMenu key="sub2" onTitleClick={handleClick}
              title={
                <span>
                  <Icon type="appstore" />
                  <span>Categories</span>
                </span>
              }
            >
              {values.map(
                (val, i) => (
                  <Menu.Item key={`${val}-${i}`}>
                    <a href={`#${i + 1}`} rel="noopener noreferrer">
                      <Icon type="setting" />{val}
                    </a>
                  </Menu.Item>
                )
              )}
            </SubMenu>
            <Menu.Item onClick={handleClick} key="sub3"><Icon type="mail" />SMTP Config</Menu.Item>
            {/*<Menu.Item onClick={handleClick} key="sub3"><Icon type="shop" />Food Provider</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub4"><Icon type="pound" />Commission</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub5"><Icon type="credit-card" />Payment</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub6"><Icon type="container" />Order</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub7"><Icon type="frown" />Complaints</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub8"><Icon type="global" />Advertisement</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub9"><Icon type="team" />Customer</Menu.Item>
          <Menu.Item onClick={handleClick} key="sub10"><Icon type="red-envelope" />Courier</Menu.Item> */}
          </Menu>
        </div>
        <div className="scrollable wrapper">
          <div className="container">{tabs[tabIndex]}</div>
        </div>
      </>
    </div>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setConfig, updateCategoriesConfig })(AdminDashboard);