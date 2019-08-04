import React, { useState, useEffect } from 'react';
import { Form, Button, message, Input, Modal, Icon } from 'antd';
import _ from 'lodash';
import axios from 'axios';
import Loader from '../../Helper/Loader';
import UploadImage from '../../Helper/UploadImage';
import { connect } from 'react-redux';
import { setSellerConfig } from '../../../redux/actions/actions';
import SellerProfileModal from './SellerProfileModal';
import '../../../scss/choice-card.scss';
import { LiteTitle } from '../../Helper/ChoiceCards';

const { confirm } = Modal;

const CommonSettings = (props) => {

  const { form } = props;
  const { getFieldDecorator, validateFields, getFieldValue } = form;

  const handleSave = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        props.handleCommonSettingsSave(values);
      }
    })
  }

  const cccn = "simple-choice-card centered";
  const oldConfig = !!props.sellerConfig && !!props.sellerConfig.commonSettings;

  return (
    <div className={cccn}>
      <div className="heading">
        <span>{oldConfig ? "Common Settings" : "Start Selling"}</span>
      </div>
      <Form onSubmit={handleSave} className="body">
        <div className="sub-heading">
          <UploadImage placeholder={"Upload Logo"} form={form} name="logo" limit={1} options={{
            rules: [{ required: true, message: "Logo is required!" }],
            initialValue: oldConfig ? props.sellerConfig.commonSettings.logo : undefined
          }} />
          <Form.Item>
            {getFieldDecorator('restaurantName', {
              initialValue: oldConfig ? props.sellerConfig.commonSettings.restaurantName : undefined,
              rules: [{ required: true, message: "Restaurant name is required!" }],
            })(
              <Input size="large" placeholder="Restaurant name" />
            )}
          </Form.Item>

        </div>
        <Button loading={props.loading} className="custom" style={{ marginTop: -30, marginBottom: 10 }} shape={"round"} size={"large"} htmlType="submit" >{oldConfig ? "Save" : "Continue"}</Button>
      </Form>
    </div>
  )
}

const WrappedCommonSettings = Form.create({ name: "common-settings" })(CommonSettings)

const BranchCard = (props) => {

  function showPropsConfirm(branchId) {
    confirm({
      title: 'Are you sure ?',
      content: <span>This action would result in permanent deletion of <strong>{props.branchName}</strong></span>,
      okText: "Yes I'm",
      okType: 'danger',
      cancelText: "Abort",
      centered: true,
      onOk() {
        props.handleDeleteBranch(branchId);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  return (
    <div className="simple-choice-card">
      <div style={{ backgroundImage: "linear-gradient(to right, #E100FF, #7F00FF)" }} className="heading">
        <span>{props.branchName}</span>
      </div>
      <div className="body">
        <div className="footer">
          <Button onClick={() => props.handleEditConfig(props.branchId)} shape={"round"} size={"large"}><Icon type="edit" /></Button>
          <Button onClick={() => showPropsConfirm(props.branchId)} shape={"round"} type="danger" size={"large"}><Icon type="delete" /></Button>
        </div>
      </div>
    </div>
  )
}

const SellerProfileTab = (props) => {
  const [visible, setVisible] = useState(false);
  const [branchId, setBranchId] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const handleCancel = () => { setVisible(false), setBranchId(undefined) };

  const handleCommonSettingsSave = (values) => {
    setLoading(true);
    axios.post('/seller/commonSettings', { values, userId: props.user._id }).then(({ data }) => {
      props.setSellerConfig(data.config);
      setLoading(false);
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) });
  }

  return (
    <Loader loading={props.loading}>
      <>
        <WrappedCommonSettings handleCommonSettingsSave={handleCommonSettingsSave}
          sellerConfig={props.sellerConfig} loading={loading} />
        {!!props.sellerConfig.branches && (
          <>
            <Button onClick={() => setVisible(true)} type="primary" size="large" shape={"round"}
              className="center-me" >Create New Branch</Button>
            <Modal width={700} visible={visible} centered={true} footer={null} title={!!branchId ? "Edit Branch" : "Create New Branch"}
              onCancel={handleCancel} maskClosable={false} destroyOnClose={true}>
              <SellerProfileModal done={() => setVisible(false)} loading={props.loading}
                handleSaveConfig={props.handleSaveConfig} sellerConfig={props.sellerConfig}
                branchId={branchId} destroyOnClose={true} />
            </Modal>
            <div style={{ marginTop: 50 }} className="space-evenly">
              <LiteTitle style={{ marginTop: 50, marginBottom: 50 }} title="Manage Branches" />
            </div>
            <div className="space-evenly">
              {
                props.sellerConfig.branches.length ? props.sellerConfig.branches.map((branch, i) => {
                  return <BranchCard key={branch.profile.branchName + "" + i}
                    branchName={branch.profile.branchName} branchId={branch._id}
                    handleEditConfig={(b_id) => { setBranchId(b_id); setVisible(true) }}
                    loading={props.loading} handleDeleteBranch={props.handleDeleteBranch} />
                }) : <div style={{ fontSize: 20, color: "grey" }} >No branches</div>
              }
            </div>
          </>
        )}
      </>
    </Loader>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setSellerConfig })(SellerProfileTab);