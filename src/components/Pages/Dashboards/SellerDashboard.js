import React, { useState, useEffect } from 'react';
import { Tabs, Button, Icon, Dropdown, Menu, message, Input } from 'antd';
import _ from 'lodash';
import SellerProfile from '../SellerDashboardTabs/SellerProfileModal';
import { connect } from 'react-redux';
import axios from 'axios';
import { setSellerConfig } from '../../../redux/actions/actions';
import Loader from '../../Helper/Loader';
import SellerProfileTab from '../SellerDashboardTabs/SellerProfileTab';

const { TabPane } = Tabs;

const SellerDashBoard = (props) => {

  const [currentKey, setCurrentKey] = useState("sellerProfile");
  const [loading, setLoading] = useState(false);
  const [branchIndex, setBranchIndex] = useState(0);
  // const [branchId, setBranchId] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    axios.get(`/seller?userId=${props.user._id}`).then(({ data }) => {
      setLoading(false);
      props.setSellerConfig(data.config);
      if (data.type == "info") {
        return message.info(data.message);
      }
      return message.success(data.message);
    }).catch((e) => { setLoading(false); return message.error(e.message) });
  }, [])

  // useEffect(() => {
  //   if (!!props.sellerConfig && JSON.stringify(props.sellerConfig) != '{}' && !!props.sellerConfig.branches[branchIndex]) {
  //     console.log(props.sellerConfig.branches[branchIndex]["_id"]);
  //     setBranchId(props.sellerConfig.branches[branchIndex]["_id"]);
  //   }
  // }, [props.sellerConfig])

  // useEffect(() => {
  //   console.log('branchId', branchId);
  // }, [branchId])

  const handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1"><Icon type="environment" />Branch 1</Menu.Item>
      <Menu.Item key="2"><Icon type="environment" />Branch 2</Menu.Item>
      <Menu.Item key="3"><Icon type="environment" />Branch 3</Menu.Item>
    </Menu>
  );

  const operations = (
    <>
      <Dropdown overlay={menu}>
        <Button type="branches">Branches <Icon type="down" /></Button>
      </Dropdown>
    </>
  )

  const handleSaveConfig = (values, name, branchId, done) => {
    setLoading(true);
    console.log(branchId);

    if (!branchId) {
      axios.post('/seller/new', { userId: props.user._id }).then(({ data }) => {
        const cloneConfig = { ...props.sellerConfig };
        cloneConfig.branches.push(data.branch);
        props.setSellerConfig(cloneConfig);
        console.log(data.config)
        branchId = data.branch._id;
        axios.post('/seller', { prop: name, userId: props.user._id, values, branchId })
          .then(({ data }) => {
            setLoading(false);
            done();
            const sellerConfigClone = { ...props.sellerConfig };
            const branch = sellerConfigClone.branches.filter(branch => branch._id === branchId)[0];
            const index = sellerConfigClone.branches.indexOf(branch);
            sellerConfigClone.branches[index] = { ...branch, [name]: data.config };
            props.setSellerConfig(sellerConfigClone);
            return message.success(data.message);
          }).catch(e => { setLoading(false); return message.error(e.message) });
      })
    }
    else {
      axios.post('/seller', { prop: name, userId: props.user._id, values, branchId })
        .then(({ data }) => {
          setLoading(false);
          done();
          const sellerConfigClone = { ...props.sellerConfig };
          const branch = sellerConfigClone.branches.filter(branch => branch._id === branchId)[0];
          const index = sellerConfigClone.branches.indexOf(branch);
          sellerConfigClone.branches[index] = { ...branch, [name]: data.config };
          props.setSellerConfig(sellerConfigClone);
          return message.success(data.message);
        }).catch(e => { setLoading(false); return message.error(e.message) });
    }
  }


  const handleDeleteBranch = (branchId) => {
    setLoading(true);
    axios.delete('/seller', { data: { userId: props.user._id, branchId } }).then(({ data }) => {
      setLoading(false);
      props.setSellerConfig(data.config);
      return message.success(data.message);
    }).catch(e => { setLoading(false); message.error(e.message) });
  }

  if (props.sellerConfig == null) {
    return <Loader />
  }

  const newConfig = JSON.stringify(props.sellerConfig) === '{}';

  const TabPanes = {
    // sellerProfile: newConfig ? (
    //   <StartSelling centered={true} heading={"Start Selling"} handleClick={(restaurantName) => props.setSellerConfig({ restaurantName, branches: [] })} />
    // ) : (
    //     <SellerProfile totalBranches={props.sellerConfig.branches.length} handleDeleteBranch={handleDeleteBranch} handleSaveConfig={handleSaveConfig} loading={loading}
    //       sellerConfig={{ restaurantName: props.sellerConfig.restaurantName, ...props.sellerConfig.branches[branchIndex] }} />
    //   ),
    sellerProfile: <SellerProfileTab loading={loading} handleDeleteBranch={handleDeleteBranch}
      handleSaveConfig={handleSaveConfig} loading={loading} sellerConfig={props.sellerConfig} />,
    foodItems: <div>Food Items</div>,
    seatArrangement: <div>Seat Arrangement</div>,
    order: <div>Order</div>,
    courier: <div>Courier</div>,
    advertisement: <div>Advertisement</div>
  }

  const handleChange = key => setCurrentKey(key);

  return (
    <>
      <div className="menu-item-page">
        <Tabs onChange={handleChange} tabBarExtraContent={operations}>
          {
            Object.keys(TabPanes).map((key) => {
              return (
                <TabPane tab={_.startCase(key)} key={key}>
                  {TabPanes[key]}
                </TabPane>
              )
            })
          }
        </Tabs>
      </div>
    </>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setSellerConfig })(SellerDashBoard);