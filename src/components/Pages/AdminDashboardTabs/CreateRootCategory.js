import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../Helper/Loader';
import RcQueueAnim from 'rc-queue-anim';
import { Form, Input, Button, Tabs, message, Icon } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { updateCategoriesConfig } from '../../../redux/actions/actions';
import CategoryApprovalTable from '../../Helper/CategoryApprovals';

const { TabPane } = Tabs;

const AddRootCategoryField = (props) => {
  const { form } = props;
  const { getFieldDecorator, resetFields, getFieldValue } = form;

  const handleCreateField = (e) => {
    e.preventDefault();
    const newCategory = getFieldValue("newCategory");
    if (newCategory.length) {
      props.handleCreateCategory(newCategory);
      if (!props.loading) resetFields();
    }
    else {
      return message.warning("Invalid Input");
    }
  }
  return (
    <div className="add-root-category">
      <Form style={{ width: "50vw" }} className="inline-form" onSubmit={handleCreateField} layout="inline" >
        {
          getFieldDecorator("newCategory")(
            <Input disabled={props.loading} size="large" placeholder="Create a root category (eg. Food Type)" />
          )
        }
        <Button loading={props.loading} type="primary" htmlType="submit" size={"large"}>Create</Button>
      </Form>
    </div>
  )
}

const WrappedAddRootCateogryField = Form.create({ name: "add-root-category" })(AddRootCategoryField);

const CreateRootCategory = (props) => {

  const { categories } = props.config;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(categories);
  }, [categories])

  const handleCreateCategory = (newCategory) => {
    if (categories.values.includes(newCategory) || categories[_.camelCase(newCategory)]) {
      return message.warning("This category already exists!");
    }

    setLoading(true);
    let categoriesClone = { ...categories }
    categoriesClone.values = [...categories.values, _.startCase(newCategory)];
    categoriesClone[_.camelCase(newCategory)] = { values: [], approval: [], colData: [] };

    axios.post('/config', {
      values: categoriesClone,
      userId: props.user._id,
      prop: "categories",
    }).then(({ data }) => {
      setLoading(false);
      props.updateCategoriesConfig(data.config);
      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  const handleSaveApproval = (data) => {
    const categoriesClone = { ...categories };
    categoriesClone["approval"] = data;
    const values = categoriesClone;

    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: "categories" }).then(({ data }) => {
      setLoading(false);

      props.updateCategoriesConfig(data.config);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  const Fragment = (props) => <>{props.children}</>;

  return (
    <div className="menu-item-page">
      <Tabs type="card" animated={true}>
        <TabPane tab="Manage" key="1">
          <WrappedAddRootCateogryField loading={loading} handleCreateCategory={handleCreateCategory} />
          <div>
            <RcQueueAnim style={{ paddingTop: "10vh", padding: "20px" }} className="space-between" >
              {
                categories.values.map((category, i) => (
                  <div className="simple-choice-card">
                    <div className="heading">
                      <span>{category}</span>
                    </div>
                    <div className="body">
                      {/* <div className="sub-heading">{subHeading}</div> */}
                      <div className="footer">
                        <Button shape={"round"} type="danger" size={"large"}><Icon type="delete" /></Button>
                        <Button onClick={()=>props.setTabIndexMenu('sub2',  i+1)} className="custom" shape={"round"} size={"large"}><Icon type="eye" /></Button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </RcQueueAnim>
          </div>
        </TabPane>
        <TabPane tab="Approval" key="2">
          <CategoryApprovalTable loading={loading} name={'categories'} handleSave={handleSaveApproval} dataSource={categories["approval"]} />
        </TabPane>
      </Tabs>

    </div>
  )
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps, { updateCategoriesConfig })(CreateRootCategory);