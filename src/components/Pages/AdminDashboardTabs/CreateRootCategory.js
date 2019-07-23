import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../Helper/Loader';
import RcQueueAnim from 'rc-queue-anim';
import { Form, Input, Button, Tabs, message, Icon, Modal } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { updateCategoriesConfig } from '../../../redux/actions/actions';
import CategoryApprovalTable from '../../Helper/CategoryApprovals';
import { CustomTitle } from '../../Helper/ChoiceCards';

const { confirm } = Modal;
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
      <Form style={{ width: "100%" }} className="inline-form" onSubmit={handleCreateField} layout="inline" >
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

const CategoryTab = (props) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(props.subCategory);

  return (
    <form onSubmit={(e) => {e.preventDefault(); setEditing(false); props.handleUpdate(text, props.subCategory); }} className="simple-choice-card">
      {!editing ? (
        <div className="heading">
          <span>{props.subCategory}</span>
        </div>
      ) : (
          <input style={{ backgroundImage: "linear-gradient(to right, #E100FF, #7F00FF)" }}
            value={text} autoFocus={true} onChange={e => setText(e.target.value)} className="heading" type="text" />
        )}
      <div className="body">
        <div className="footer">
          {
            !editing ? (
              <>
                <Button onClick={() => { setEditing(true); setText(props.subCategory) }} shape={"round"} size={"large"}><Icon type="edit" /></Button>
                <Button onClick={() => props.handldeNameHistoryChange(props.subCategory)} type="primary" shape={"round"} size={"large"}><Icon type="eye" /></Button>
                <Button onClick={() => props.hanldeDelete(props.subCategory)} shape={"round"} type="danger" size={"large"}><Icon type="delete" /></Button>
              </>
            ) : (
                <>
                  <Button onClick={() => setEditing(false)} shape={"round"} type="danger" ghost={true} size={"large"}><Icon type="close" /></Button>
                  <Button htmlType="submit" type="primary" ghost={true} shape={"round"} size={"large"}><Icon type="check" /></Button>
                </>
              )
          }
        </div>
      </div>
    </form>
  )
}

const CreateRootCategory = (props) => {

  const { categories } = props.config;
  const [loading, setLoading] = useState(false);
  const [nameHistory, setNameHistory] = useState(["categories"]);


  useEffect(() => {
    console.log('useEffect', nameHistory);
  }, [nameHistory])

  const handleCreateCategory = (newCategory) => {
    let categoriesClone = { ...categories }
    let nameHistoryClone = [...nameHistory];

    nameHistoryClone[0] = "categoriesClone";

    let obj = eval(nameHistoryClone.join('.'));

    newCategory = _.startCase(_.toLower(newCategory));

    console.log(newCategory);

    if (obj.values.includes(newCategory) || obj[_.camelCase(newCategory)]) {
      return message.warning("This category already exists!");
    }

    setLoading(true);
    obj.values = [...obj.values, _.startCase(newCategory)];
    obj[_.camelCase(newCategory)] = { values: [] };

    console.log(categoriesClone);

    axios.post('/config', { values: categoriesClone, userId: props.user._id, prop: "categories", })
      .then(({ data }) => {
        setLoading(false);
        props.updateCategoriesConfig(data.config);
        return message.success(data.message);
      }).catch((e) => {
        const error = JSON.parse(JSON.stringify(e.response.data));
        setLoading(false);
        return message.error(error.message);
      })
  }

  const handleDeleteCategory = (category) => {
    let categoriesClone = { ...categories };
    let nameHistoryClone = [...nameHistory];

    nameHistoryClone[0] = "categoriesClone";

    let obj = eval(nameHistoryClone.join('.'));

    obj.values = obj.values.filter((val) => val != category);
    delete obj[_.camelCase(category)];
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

  function showPropsConfirm(category) {
    confirm({
      title: 'Are you sure ?',
      content: `This action would result in permanent deletion of ${category}`,
      okText: "Yes I'm",
      okType: 'danger',
      cancelText: "Abort",
      centered: true,
      onOk() {
        handleDeleteCategory(category);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  const handleCrumbClick = (nh) => {
    const index = nameHistory.indexOf(nh);
    console.log(index);
    const updatedNH = [...nameHistory]
    updatedNH.length = index + 1;
    console.log(updatedNH);
    setNameHistory(updatedNH);
  }

  const updateSubcategory = (changedText, category) => {
    let categoriesClone = { ...categories };
    let nameHistoryClone = [...nameHistory];

    if(_.toLower(changedText) == _.toLower(category)){
      return messsage.warning("Nothing changed");
    }

    nameHistoryClone[0] = "categoriesClone";

    let obj = eval(nameHistoryClone.join('.'));

    const index = obj.values.indexOf(category);
    changedText = _.toLower(changedText);
    console.log(changedText);
    obj.values[index] = _.startCase(changedText);
    obj[_.camelCase(changedText)] = obj[_.camelCase(category)];
    delete obj[_.camelCase(category)];
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

  return (
    <div className="menu-item-page">
      <Tabs type="card" animated={true}>
        <TabPane tab="Manage" key="1">
          <div className="bread-crumb">
            {nameHistory.map((nh) => (
              <><span onClick={() => handleCrumbClick(nh)} className="route">{_.startCase(nh)}</span><span>/</span></>
            ))}
          </div>
          <WrappedAddRootCateogryField loading={loading} handleCreateCategory={handleCreateCategory} />
          <div>
            <RcQueueAnim className="space-evenly" >
              {
                eval(nameHistory.join('.')).values.map((subCategory, i) => (
                  <CategoryTab subCategory={subCategory}
                    hanldeDelete={(subCategory) => showPropsConfirm(subCategory)}
                    handleUpdate={updateSubcategory}
                    handldeNameHistoryChange={(sc) => setNameHistory([...nameHistory, _.camelCase(sc)])}
                  />
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