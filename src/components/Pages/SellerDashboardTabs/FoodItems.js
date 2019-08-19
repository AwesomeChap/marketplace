import React, { useState, useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import FoodItemModalForm from './FoodItemModalForm';
import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import { setConfig, setSellerConfig } from '../../../redux/actions/actions';
import GenericModalTable from '../../Helper/GenericModalTable';
import ColData from './ColData';
import Loader from '../../Helper/Loader';
import "regenerator-runtime/runtime";

const typeToTreeData = (array) => {
  let treeObj = {};

  array.forEach((item, i) => {
    if (!treeObj.hasOwnProperty([_.camelCase(item.type)])) {
      treeObj[_.camelCase(item.type)] = [];
    }
    treeObj[_.camelCase(item.type)].push({ title: item.name, value: item.name, key: `${_.camelCase(item.name)}-${i}` });
  })

  let treeArray = Object.keys(treeObj).map((type) => {
    return {
      title: _.startCase(type),
      value: _.startCase(type),
      key: type,
      selectable: false,
      children: treeObj[type]
    }
  })

  return treeArray;
}

const categoriesToTreeData = (treeData, obj) => {
  obj.values.map((val, i) => {
    let v = {
      title: val,
      value: val,
      key: `${_.camelCase(val)}-${i}`,
    }
    if (obj[_.camelCase(val)].values.length) {
      v["children"] = [];
      v = { ...v, children: categoriesToTreeData(v["children"], obj[_.camelCase(val)]) }
    }
    treeData.push(v);
  })
  return treeData;
}

const FoodItemsTab = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [currentFoodItemData, setCurrentFoodItemData] = useState(null);

  useEffect(() => {
    axios.get(`/config?userId=${props.user._id}`).then(({ data }) => {
      props.setConfig(data.config);
    })
  }, [])

  useEffect(() => {
    if (!!props.config && Object.keys(props.config).length) {
      const opts = {
        type: ["Veg", "Non Veg"],
        serveTime: props.config.time.values.map((value) => value.name),
        category: categoriesToTreeData([], props.config.categories),
        flavours: props.config.flavours.values.map((value) => value.name),
        spiceLevel: props.config.spices.values.map((value) => value.name),
        allergies: props.config.allergy.values.map((value) => value.name),
        ingredients: typeToTreeData(props.config.ingredients.values),
        nutrition: typeToTreeData(props.config.nutrition.values),
      }
      setOptions(opts);
    }
  }, [props.config])

  if (!props.branchId) {
    return <div>No Branches Found!</div>
  }

  const handleSaveFoodItem = (foodItem, done) => {
    setLoading(true);

    axios.post('/seller/foodItem', { userId: props.user._id, branchId: props.branchId, foodItem }).then(({ data }) => {
      const resfoodItem = data.foodItem;
      const sellerConfigClone = { ...props.sellerConfig };

      if (!foodItem.hasOwnProperty("_id")) {
        //add
        sellerConfigClone.foodItems = [...sellerConfigClone.foodItems, foodItem = resfoodItem]
      }
      else {
        //update
        const foodItemIndex = sellerConfigClone.foodItems.map(obj => obj._id).indexOf(foodItem._id);
        sellerConfigClone.foodItems[foodItemIndex] = resfoodItem;
      }
      props.setSellerConfig(sellerConfigClone);
      setLoading(false); done();
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) })
  }

  const transferFoodItem = async (foodItemId, branches) => {
    setLoading(true);

    let promises = [];

    branches.forEach(branch => {
      promises.push(axios.post('/seller/foodItem', { userId: props.user._id, branchId: branch.id, foodItem: currentFoodItemData }))
    })

    try {
      const resArray = await axios.all(promises);

      resArray.map((res, i) => {
        try {
          const { foodItem } = res.data;
          const sellerConfigClone = { ...props.sellerConfig };
          if (!sellerConfigClone.foodItems.includes(foodItem)) {
            sellerConfigClone.foodItems = [...sellerConfigClone.foodItems, foodItem]
          }
          else {
            const foodItemIndex = sellerConfigClone.foodItems.map(obj => obj._id).indexOf(foodItemId);
            sellerConfigClone.foodItems[foodItemIndex] = foodItem
          }
          props.setSellerConfig(sellerConfigClone);
        }
        catch (e) {
          console.log(e);
        }
      })
    }
    catch (e) {
      return message.error("Unable to transfer");
    }

    setLoading(false);
    return message.success("Transfer done!");
  }

  const handleCancel = () => setVisible(false);

  const handleDeleteItem = (id) => {
    setLoading(true);
    axios.delete('/seller/foodItem', { data: { userId: props.user._id, branchId: props.branchId, foodItemId: id } }).then(({ data }) => {
      props.setSellerConfig(data.config);
      setLoading(false);
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message); });
  }

  const openEditModal = (id) => {
    const foodItemIndex = props.sellerConfig.foodItems.map(obj => obj._id).indexOf(id);
    const cfid = props.sellerConfig.foodItems[foodItemIndex];
    setCurrentFoodItemData(cfid);
    setVisible(true);
  }

  const transformConfigToDatasource = (foodItems) => {
    const data = foodItems.map((foodItem, key) => {
      return {
        key: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        image: foodItem.image,
        type: foodItem.type,
        category: foodItem.category
      }
    })
    return data;
  }

  let foodItemModalFormProps = {
    done: () => setVisible(false), loading, options, branches: props.branches,
    handleSaveFoodItem, foodItemData: {}, transferFoodItem, branchId: props.branchId,
    branches : props.sellerConfig.branches.map( branch => ({id: branch._id, name: branch.profile.branchName}))
  }

  if (props.config) {
    foodItemModalFormProps = {
      ...foodItemModalFormProps,
      ingredients: props.config.ingredients.values,
      nutrition: props.config.nutrition.values,
      foodItem: currentFoodItemData
    }
  }

  if (!props.branchId) {
    return <Loader />
  }

  return (
    <div className="menu-item-page">
      <Loader loading={loading}>
        <Button className="top-right-absolute" onClick={() => { setCurrentFoodItemData(null); setVisible(true) }} type="primary">Add Food Item</Button>
        <Modal width={1000} visible={visible} centered={true} footer={null} onCancel={handleCancel} maskClosable={false}
          destroyOnClose={true} title={!!currentFoodItemData ? "Edit Food Item" : "Create Food Item"} >
          <FoodItemModalForm {...foodItemModalFormProps} />
        </Modal>
        <GenericModalTable name="foodItems" openEditModal={openEditModal} handleDeleteItem={handleDeleteItem} colData={ColData["foodItems"]} dataSource={transformConfigToDatasource(props.sellerConfig.foodItems)} />
      </Loader>
    </div>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setConfig, setSellerConfig })(FoodItemsTab);