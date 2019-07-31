import React, { useState, useEffect } from 'react';
import { Form, Typography, Divider, Select, Input, Icon, Tooltip, Button, message, notification } from 'antd';
import axios from 'axios';
import Loader from '../../Helper/Loader';
import { connect } from 'react-redux';
import { setConfig } from '../../../redux/actions/actions';
import ConfigForm from '../../Helper/ConfigForm';

//props required: {user}

const PaypalConfig = (props) => {

  const [loading, setLoading] = useState(false);
  const { form } = props;
  const { getFieldDecorator } = form;
  const [paypalConfig, setPaypalConfig] = useState({
    clientId: "",
    secret: "",
  });

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

  //create an endpoint /customer/paypal to return user.paypal

  useEffect(() => {
    setLoading(props);
    axios.get(`/customer?userId=${props.user._id}&prop=paypal`).then(({ data }) => {
      setLoading(false);
      if (data.hasOwnProperty("config")) {
        setPaypalConfig(data.config);
      }
      if(data.type === "info"){
        return message.info(data.message);
      }
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true);
        console.log(values);
        axios.post('/customer', { values, userId: props.user._id, prop: "paypal" }).then(({ data }) => {
          setLoading(false);
          setPaypalConfig(data.config);
          return message.success(data.message);
        }).catch((e) => {
          const error = JSON.parse(JSON.stringify(e.response.data));
          setLoading(false);
          return message.error(error.message);
        })
      }
    });
  }

  return (
    <Loader loading={loading}>
      <div className="menu-item-page">
        <Form layout={"vertical"} {...formItemLayout} onSubmit={handleSubmit}>

          <ConfigForm title="Paypal Config">
            <Form.Item label="Id">
              {getFieldDecorator('clientId', {
                initialValue: paypalConfig.clientId,
                rules: [{ required: true, message: 'Paypal client Id is required' }],
              })(<Input placeholder="eg. Paypal client id goes here..." />)}
            </Form.Item>

            <Form.Item label="Secret">
              {getFieldDecorator('secret', {
                initialValue: paypalConfig.secret,
                rules: [{ required: true, message: "Paypal secret is required" }]
              })(
                <Input.Password placeholder="Paypal secret goes here..." />
              )}
            </Form.Item>
          </ConfigForm>

          <Button className="center-me" shape={"round"} size="large" loading={loading} htmlType={"submit"} type="primary">Save</Button>

        </Form>
      </div>
    </Loader>
  )
}


const WrappedPaypalConfig = Form.create({ name: "paypal-config" })(PaypalConfig);

export default WrappedPaypalConfig;