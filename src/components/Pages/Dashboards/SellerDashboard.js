import React, { useState, useEffect } from 'react';
import { Tabs, Button, Icon, Dropdown, Menu, message, Input, Empty } from 'antd';
import _ from 'lodash';
import FoodItemsTab from '../SellerDashboardTabs/FoodItems';
import { connect } from 'react-redux';
import axios from 'axios';
import { setSellerConfig, setBranchId } from '../../../redux/actions/actions';
import Loader from '../../Helper/Loader';
import SellerProfileTab from '../SellerDashboardTabs/SellerProfileTab';
import SeatArrangement from '../SellerDashboardTabs/SeatArrangement';

const { TabPane } = Tabs;

const SellerDashBoard = (props) => {

  const [currentKey, setCurrentKey] = useState("sellerProfile");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/seller?userId=${props.user._id}`).then(({ data }) => {
      setLoading(false);
      props.setSellerConfig(data.config);
      if (!!data.config && JSON.stringify(data.config) !== '{}' && data.config.branches.length) {
        props.setBranchId(data.config.branches[0]._id);
      }
      if (data.type == "info") {
        return message.info(data.message);
      }
      return message.success(data.message);
    }).catch((e) => { setLoading(false); return message.error(e.message) });
  }, [])

  const newConfig = JSON.stringify(props.sellerConfig) === '{}';

  const handleMenuClick = (e) => {
    props.setBranchId(e.key);
  }

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
            if (!!props.sellerConfig && JSON.stringify(props.sellerConfig) !== '{}' && props.sellerConfig.branches.length) {
              props.setBranchId(props.sellerConfig.branches[0]._id);
            }
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

  const menu = (
    <Menu selectedKeys={[props.branchId]} onClick={handleMenuClick}>
      {newConfig || !newConfig && !props.sellerConfig.branches.length ? <Menu.Item disabled={true}> <Empty imageStyle={{ height: 50 }} description={<span style={{ fontSize: 12 }}>No Branches</span>} /> </Menu.Item> : props.sellerConfig.branches.map((branch, i) => <Menu.Item key={branch._id}><Icon type="environment" />{branch.profile.branchName}</Menu.Item>)}
    </Menu>
  );

  const operations = (
    <>
      <Dropdown overlay={menu}>
        <Button type="branches">Branches <Icon type="down" /></Button>
      </Dropdown>
    </>
  )

  const TabPanes = {
    sellerProfile: <SellerProfileTab loading={loading} handleDeleteBranch={handleDeleteBranch} handleSaveConfig={handleSaveConfig} sellerConfig={props.sellerConfig} />,
    foodItems: <FoodItemsTab branches={!!props.sellerConfig.branches && props.sellerConfig.branches.map(branch => ({name: branch.profile.branchName, id: branch._id}))} />,
    seatArrangement: <SeatArrangement done={() => setLoading(false)} loading={loading} handleSaveConfig={handleSaveConfig} sellerConfig={props.sellerConfig} branchId={props.branchId} />,
    order: <div>Order</div>,
  }

  const handleChange = key => setCurrentKey(key);
  const tabHeaders = ["foodItems", "seatArrangement", "order"];

  const dinningPossible = () => {
    const branchIndex = props.sellerConfig.branches.map(obj => obj._id).indexOf(props.branchId);
    return !!props.branchId && !!props.sellerConfig.branches && props.sellerConfig.branches[branchIndex].profile.serviceOptions.includes("Dinning In");
  }

  return (
    <>
      <div style={{ paddingBottom: 0 }} className="menu-item-page">
        <Tabs destroyInactiveTabPane={true} onChange={handleChange} activeKey={currentKey} tabBarExtraContent={operations}>
          {
            Object.keys(TabPanes).map((key) => {
              return (
                <TabPane disabled={(tabHeaders.includes(key) && (newConfig || !props.sellerConfig.branches || !props.sellerConfig.branches.length)) || (key === "seatArrangement" && !dinningPossible())} tab={_.startCase(key)} key={key}>
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

export default connect(mapStateToProps, { setSellerConfig, setBranchId })(SellerDashBoard);