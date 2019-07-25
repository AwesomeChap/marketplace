import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Switch } from 'antd';
import UploadImage from '../../Helper/UploadImage';

const { Option } = Select;

const SellerProfile = (props) => {
  const { form } = props;
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const services = ["Dinning In", "Take Away", "Delivery"];
  const modeOfService = ["Food is delivered", "Service personnel"];

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <UploadImage form={form} label="Logo" name="logo" limit={1} />
      <Form.Item label="Branch Name" >
        {getFieldDecorator('branchName', {
          rules: [{ required: true, message: "Branch name is required!" }]
        })(<Input placeholder="Branch Name" />)}
      </Form.Item>
      <Form.Item label="Address" >
        {getFieldDecorator('address', {
          rules: [{ required: true, message: "Address is required!" }]
        })(<Input.TextArea placeholder="Address" />)}
      </Form.Item>
      <Form.Item label="Available Services">
        {getFieldDecorator('serviceOptions', {
          rules: [{ required: true, message: "Services are required!" }]
        })(
          <Select mode="multiple" placeholder="Please select available service options">
            {services.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
          </Select>
        )}
      </Form.Item>
      <UploadImage form={form} label="Photos" name="photos" />
      <Form.Item label="Catering Service Available">
        {getFieldDecorator('cateringService.available', {
          initialValue: false, valuePropName: 'checked',
          rules: [{ required: true, message: "Catering service availabilty status required!" }]
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="Catering Service Coverage Area">
        {getFieldDecorator('cateringService.coverageArea', {
          initialValue: "",
          rules: [{ required: true, message: "Catering service coverage required!" }]
        })(<InputNumber placeholder="Coverage Area" />)}
      </Form.Item>
      <Form.Item label="Mode of Service">
        {getFieldDecorator('cateringService.modeOfService', {
          initialValue: [],
          rules: [{ required: true, message: "Mode of service is required!" }]
        })(
          <Select mode="multiple" placeholder="Please select mode of services">
            {modeOfService.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
          </Select>
        )}
      </Form.Item>
    </Form>
  )
}

export default Form.create({ name: "seller_profile" })(SellerProfile);

// logo: {},
// branchName: String,
// address: String,
// service: [String], //dining in, take away, delivery
// photos: [],
// cateringService: {
//   available: Boolean,
//   coverageArea: Number,
//   quantityOfFoodPerMember: Number,
//   serviceType: String // food is delivered, service personnel, 
// }