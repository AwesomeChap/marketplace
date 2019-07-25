import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Switch, Button, TimePicker } from 'antd';
import UploadImage from '../../Helper/UploadImage';
import moment from 'moment';
import Loader from '../../Helper/Loader';

const { Option } = Select;

const SellerProfile = (props) => {
  const { form } = props;
  const { getFieldDecorator, validateFields, getFieldValue } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        values["openingTime"] = values["openingTime"].format('hh:mm A');
        values["closingTime"] = values["closingTime"].format('hh:mm A');
        props.handleSaveConfig(values, "profile", props.branchId, props.done);
      }
    })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 9 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  const services = ["Dinning In", "Take Away", "Delivery"];
  const modeOfService = ["Food is delivered", "Service personnel"];

  // const newConfig = Object.keys(sellerConfig).length == 1;
  const newConfig = !props.branchId;

  let profile;

  (!newConfig && props.sellerConfig.branches.length) ? profile = props.sellerConfig.branches.filter(branch => branch._id == props.branchId)[0].profile : undefined;

  return (
    <>
      <Form style={{ position: "relative" }} {...formItemLayout} onSubmit={handleSubmit}>
        {/* {!!props.totalBranches && <Form.Item className="top-right-absolute">
          <Button onClick={props.handleDeleteBranch} icon="delete" type="danger">
            {props.totalBranches == 1 ? "Delete Seller Profile" : "Delete this Branch"}
          </Button>
        </Form.Item>}
        <Form.Item label="Restaurant Name" >
          <span>{sellerConfig.restaurantName}</span>
        </Form.Item>
        <UploadImage form={form} label="Logo" name="logo" limit={1} options={{
          rules: [{ required: true, message: "Logo is required!" }],
          initialValue: newConfig ? undefined : profile.logo
        }} /> */}
        <Form.Item label="Branch Name" >
          {getFieldDecorator('branchName', {
            rules: [{ required: true, message: "Branch name is required!" }],
            initialValue: newConfig ? undefined : profile.branchName
          })(<Input placeholder="Branch Name" />)}
        </Form.Item>
        <Form.Item label="Address" >
          {getFieldDecorator('address', {
            rules: [{ required: true, message: "Address is required!" }],
            initialValue: newConfig ? undefined : profile.address
          })(<Input.TextArea placeholder="Address" />)}
        </Form.Item>
        <Form.Item label="Opening Time">
          {getFieldDecorator('openingTime', {
            initialValue: newConfig ? moment('10:00', 'hh:mm A') : moment(profile.openingTime, 'hh:mm A')
          })(<TimePicker format='hh:mm A' />)}
        </Form.Item>
        <Form.Item label="Closing Time">
          {getFieldDecorator('closingTime', {
            initialValue: newConfig ? moment('22:00', 'hh:mm A') : moment(profile.closingTime, 'hh:mm A')
          })(<TimePicker format='hh:mm A' />)}
        </Form.Item>
        <Form.Item label="Available Services">
          {getFieldDecorator('serviceOptions', {
            rules: [{ required: true, message: "Services are required!" }],
            initialValue: newConfig ? undefined : profile.serviceOptions
          })(
            <Select mode="multiple" placeholder="Please select available service options">
              {services.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
            </Select>
          )}
        </Form.Item>
        <UploadImage form={form} label="Photos" name="photos" options={{
          initialValue: newConfig ? undefined : profile.photos
        }} />
        <Form.Item label="Catering Service Available">
          {getFieldDecorator('cateringService.available', {
            initialValue: newConfig ? false : profile.cateringService.available,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
        {getFieldValue('cateringService.available') && (
          <>
            <Form.Item label="Catering Service Coverage Area">
              {getFieldDecorator('cateringService.coverageArea', {
                initialValue: newConfig ? undefined : (profile.cateringService.coverageArea || null),
                rules: [{ required: true, message: "Catering service coverage required!" }]
              })(<InputNumber placeholder="Coverage Area" />)}
            </Form.Item>
            <Form.Item label="Mode of Service">
              {getFieldDecorator('cateringService.modeOfService', {
                initialValue: newConfig ? undefined : profile.cateringService.modeOfService,
                rules: [{ required: true, message: "Mode of service is required!" }]
              })(
                <Select mode="multiple" placeholder="Please select mode of services">
                  {modeOfService.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
                </Select>
              )}
            </Form.Item>
          </>
        )}
        <Button className="center-me" shape={"round"} size="large" loading={props.loading} htmlType={"submit"} type="primary">Save</Button>
      </Form>
    </>
  )
}

export default Form.create({ name: "seller_profile" })(SellerProfile);
