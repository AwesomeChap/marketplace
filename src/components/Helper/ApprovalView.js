import React, { useState, useEffect } from 'react';
import { Modal, Form, Alert, message, Row, Col, Button } from 'antd';
import _ from 'lodash';
import Loader from './Loader';
import { connect } from 'react-redux';
import { setConfig } from '../../redux/actions/actions';
import axios from 'axios';
import UploadImage from './UploadImage';
import ColData from './ColData2';
import GenericApprovalTable from './GenericApprovalTable';

const ApproveSuggestions = (props) => {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentItemData, setCurrentItemData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  const { form } = props;
  const { getFieldDecorator } = form;

  useEffect(() => {
    setLoading(true);
    let prop;
    if(props.name == "time") prop = "serveTime";
    else if(props.name == "spices") prop = "spiceLevels";
    else prop = props.name;
    axios.get(`/approval?userId=${props.user._id}&prop=${prop}`).then(({ data }) => {
      if (data.approvals) {
        setLoading(false);
        setDataSource(data.approvals);
      }
    }).catch(e => { setLoading(false); return (e.message) })
  }, [])

  const handleDeleteItem = () => {
    setLoading(true);
    axios.delete('/approval', { data: { userId: props.user._id, approvalId: dataSource.find(el => el.key === currentItemData.key)._id } })
      .then(({ data }) => {
        setLoading(false);
        const updatedApprovals = dataSource.filter((approval) => approval._id != data.approval._id);
        console.log('up', updatedApprovals);
        const configClone = { ...props.config };
        configClone[props.name][approval] = updatedApprovals;
        setConfig(configClone);
        setVisible(false);
        setCurrentItemData(null);
        return message.success(data.message);
      }).catch(e => { setLoading(false); return message.error(e.message) });
  }

  const handleSaveItem = (status, key) => {
    console.log(status, key);
    let value = dataSource.find(el => el.key === key);
    const index = dataSource.indexOf(value);
    console.log(index);
    value = {...value, status};
    setLoading(true);
    axios.put('/approval', { value, userId: props.user._id }).then(({data}) => {
      let dataSourceClone = [...dataSource];
      dataSourceClone[index] = data.approval;
      let configClone = {...props.config};
      configClone[props.name] = data.config;
      props.setConfig(configClone);
      setDataSource(dataSourceClone);
      setLoading(false);
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) });
  }

  const viewComponent = {
    categories: !!currentItemData && props.name === "categories" && (
      <>
        <Form.Item label={"Root"}>{getFieldDecorator("categories.values")(<span>{currentItemData.data.values.join(' / ')}</span>)}</Form.Item>
        <Form.Item label={"Sub-category"}>{getFieldDecorator("categories.subCategory")(<span>{currentItemData.data.subCategory}</span>)}</Form.Item>
      </>
    ),
    ingredients: !!currentItemData && props.name === "ingredients" && (
      <>
        <Form.Item label="Name">{getFieldDecorator("ingredients.name")(<span>{currentItemData.data.name}</span>)}</Form.Item>
        <UploadImage label="Image" form={form} limit={1} name="ingredients.image" options={{ initialValue: currentItemData.data.image }} />
        <Form.Item label="Type">{getFieldDecorator("ingredients.type")(<span>{currentItemData.data.type}</span>)}</Form.Item>
        <Form.Item label="Description">{getFieldDecorator("ingredients.description")(<span>{currentItemData.data.description}</span>)}</Form.Item>
      </>
    ),
    flavours: !!currentItemData && props.name === "flavours" && (
      <>
        <Form.Item label="Name">{getFieldDecorator("flavours.name")(<span>{currentItemData.data.name}</span>)}</Form.Item>
        <Form.Item label="Description">{getFieldDecorator("flavours.description")(<span>{currentItemData.data.description}</span>)}</Form.Item>
      </>
    ),
    spiceLevels: !!currentItemData && props.name === "spiceLevels" && (
      <>
        <Form.Item label="Name">{getFieldDecorator("spiceLevels.name")(<span>{currentItemData.data.name}</span>)}</Form.Item>
        <UploadImage label="Image" form={form} limit={1} name="spiceLevels.image" options={{ initialValue: currentItemData.data.image }} />
      </>
    ),
    allergy: !!currentItemData && props.name === "allergy" && <Form.Item label="Name">{getFieldDecorator("allergy.name")(<span>{currentItemData.data.name}</span>)}</Form.Item>,
    serveTime: !!currentItemData && props.name === "serveTime" && <Form.Item label="Name">{getFieldDecorator("serveTime.name")(<span>{currentItemData.data.name}</span>)}</Form.Item>
  }

  const openViewModal = (key) => {
    console.log(key);
    const currentItem = dataSource.find(el => el.key === key);
    setCurrentItemData(currentItem);
    console.log(currentItem);
    setVisible(true);
  }

  const openViewUserModal = (userId) => {
    //make api call and fetch userData
    setCurrentUserData("User Data");
    //and set it to user data
    setVisible(true);
  }

  const handleCancel = () => {
    setCurrentItemData(null);
    setVisible(false);
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
  };

  return (
    <Loader loading={loading}>
      <div className="menu-item-page">
        <Modal title={!!currentItemData ? `Suggestion for ${_.startCase(props.name)}` : "User Info"} width={600} visible={visible} footer={null}
          onCancel={handleCancel} centered={true} maskClosable={false} destroyOnClose={true}>
          <Form {...formItemLayout}>
           {!!currentItemData && currentItemData.status === "Pending" && <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}><Alert message="To unlock delete button, Please either approve it or reject it" type="info" closable /></Form.Item>}
            {!!currentItemData ? viewComponent[props.name] : currentUserData}
            <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}>
              <Row type="flex" justify="center">
                <Col>
                  {!!currentItemData && <Button disabled={currentItemData.status === "Pending"} onClick={handleDeleteItem} className="center-me" shape={"round"} size="large" loading={loading} htmlType={"submit"} type="danger">Delete</Button>}
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
        <GenericApprovalTable openViewUserModal={openViewUserModal} handleDeleteItem={handleDeleteItem} handleSaveItem={handleSaveItem} openViewModal={openViewModal} colData={ColData["admin"]} dataSource={dataSource} name={"approval-view"} />
      </div>
    </Loader>
  )
}

const mapStateToProps = state => state;

const WrappedApproveSuggestions = Form.create({ name: "approve-suggestions" })(ApproveSuggestions);

export default connect(mapStateToProps, { setConfig })(WrappedApproveSuggestions);