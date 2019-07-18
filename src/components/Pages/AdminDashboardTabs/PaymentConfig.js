import React, { useState, useEffect } from 'react';
import { Form, Typography, Divider, Select, Input, Icon, Tooltip, Button, message, notification } from 'antd';
import axios from 'axios';
import Loader from '../../Helper/Loader';
import { connect } from 'react-redux';
import { setConfig } from '../../../redux/actions/actions';
import ConfigForm from '../../Helper/ConfigForm';

const PaymentConfig = (props) => {

  const [loading, setLoading] = useState(false);
  const { form } = props;
  const { getFieldDecorator } = form;
  const { payment } = props.config;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setLoading(true);
        axios.post('/config', { values, userId: props.user._id, prop: "payment" }).then(({ data }) => {
          setLoading(false);

          const configClone = { ...props.config };
          configClone["payment"] = data.config;

          props.setConfig(configClone);

          return message.success(data.message);
        }).catch((e) => {
          const error = JSON.parse(JSON.stringify(e.response.data));
          setLoading(false);
          return message.error(error.message);
        })
      }
    });
  }

  if (!payment) {
    return <Loader />
  }

  const newConfig = JSON.stringify(payment) == "{}";

  return (
    <Loader loading={!payment}>
      <div className="menu-item-page">
        <Form layout={"vertical"} {...formItemLayout} onSubmit={handleSubmit}>

          <ConfigForm title="Paypal Config">
            <Form.Item label="Id">
              {getFieldDecorator('id', {
                initialValue: !newConfig && payment.id || "",
                rules: [{ required: true, message: 'Paypal client Id is required' }],
              })(<Input placeholder="eg. Paypal client id goes here..." />)}
            </Form.Item>

            <Form.Item label="Secret">
              {getFieldDecorator('secret', {
                initialValue: !newConfig && payment.secret || "",
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

const mapStateToProps = state => ({ config: state.config });

const WrappedPayment = Form.create({ name: "payment-config" })(PaymentConfig);

export default connect(mapStateToProps, { setConfig })(WrappedPayment);