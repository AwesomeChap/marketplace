import React, { useState, useEffect } from 'react';
import { Form, Typography, Divider, Select, Input, Icon, Tooltip, Button, message, notification } from 'antd';
import axios from 'axios';
import Loader from '../../Helper/Loader';
import { connect } from 'react-redux';
import { setConfig, updateMailConfig } from '../../../redux/actions/actions';

const { Title } = Typography;
const { OptGroup, Option } = Select;

const VerifyEmailConfig = (props) => {

  const [loading, setLoading] = useState(false);
  const { form } = props;
  const { getFieldDecorator } = form;
  const { mail } = props.config;

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

  const hasToken = (rule, value, callback) => {
    if (!value.length || value.includes("{{token}}")) callback();
    else callback("{{token}} is required");
  }

  const removeEmptyStrings = (obj) => {
    Object.keys(obj).forEach(key => {

      if (obj[key] === "") delete obj[key];

      if (typeof obj[key] === 'object') {
        removeEmptyStrings(obj[key])
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.smtpConfig.port == '465') {
          values.smtpConfig.secure = true;
        }
        else {
          values.smtpConfig.secure = false;
        }

        removeEmptyStrings(values);

        setLoading(true);
        axios.post('/config', { values, userId: props.user._id, prop: "mail" }).then(({ data }) => {
          setLoading(false);

          props.updateMailConfig(data.config);

          return message.success(data.message);
        }).catch((e) => {
          const error = JSON.parse(JSON.stringify(e.response.data));
          setLoading(false);
          return message.error(error.message);
        })
      }
    });
  }

  if (!mail) {
    return <Loader />
  }

  const newConfig = JSON.stringify(mail) == "{}";

  return (
    <div className="menu-item-page">
      <Form layout={"vertical"} {...formItemLayout} onSubmit={handleSubmit}>
        <Title id="1" level={3} >Transporter Config</Title>

        <Form.Item label="Host">
          {getFieldDecorator('smtpConfig.host', {
            initialValue: !newConfig && mail.smtpConfig.host || "",
            rules: [{ required: true, message: 'Please enter a host' }],
          })(<Input placeholder="eg. smtp.gmail.com" style={{ width: 330 }} />)}
        </Form.Item>

        <Form.Item label="Port">
          {getFieldDecorator('smtpConfig.port', {
            initialValue: !newConfig && mail.smtpConfig.port || undefined,
            rules: [{ required: true, message: "Please specify a port" }]
          })(
            <Select placeholder="eg. 465" style={{ width: 330 }}>
              <OptGroup label="SSL connections">
                <Option value={465}>465</Option>
              </OptGroup>
              <OptGroup label="TLS connections">
                <Option value={25}>25</Option>
                <Option value={587}>587</Option>
              </OptGroup>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Username" >
          {getFieldDecorator('smtpConfig.auth.user', {
            initialValue: !newConfig && mail.smtpConfig.auth.user || "",
            rules: [{ required: true, message: "Please enter a username" }]
          })(
            <Input placeholder="Username" style={{ width: 330 }} />
          )}
        </Form.Item>

        <Form.Item label="Password" >
          {getFieldDecorator('smtpConfig.auth.pass', {
            initialValue: !newConfig && mail.smtpConfig.auth.pass || "",
            rules: [{ required: true, message: "Please enter a password" }]
          })(
            <Input type="password" placeholder="Password" style={{ width: 330 }} />
          )}
        </Form.Item>

        <Divider></Divider>

        <Title id="2" level={3} >Mail Options</Title>

        <Form.Item label="From" >
          {getFieldDecorator('mailOptions.from', {
            initialValue: !newConfig && mail.mailOptions.from || "",
            rules: [
              { type: "email", message: "Please enter a valid email address" },
              { required: true, message: "Sender's address is required" }
            ]
          })(
            <Input placeholder="eg. alex@domain.com" style={{ width: 330 }} />
          )}
        </Form.Item>

        <Form.Item label="Subject" >
          {getFieldDecorator('mailOptions.subject', {
            initialValue: !newConfig && mail.mailOptions.subject || ""
          })(
            <Input placeholder="eg. Activation Token Email" style={{ width: 330 }} />
          )}
        </Form.Item>

        <Form.Item label="Salutation" >
          {getFieldDecorator("mailOptions.text.salutation", {
            initialValue: !newConfig && mail.mailOptions.text.salutation || ""
          })(
            <Input placeholder="eg. Hello," style={{ width: 330 }} />
          )}
        </Form.Item>

        <Form.Item label="Body" >
          {getFieldDecorator("mailOptions.text.body", {
            initialValue: !newConfig && mail.mailOptions.text.body || "",
            rules: [
              { validator: hasToken }
            ]
          })(
            <Input.TextArea allowClear
              suffix={
                <Tooltip title={"Please include {{token}} in your text, It specifies position of the auth token"}>
                  <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
              autosize={{ minRows: 2, maxRows: 6 }}
              placeholder="eg. Your verification token is {{token}}"
              style={{ width: 330 }} />
          )}
        </Form.Item>

        <Form.Item label="Close" >
          {getFieldDecorator("mailOptions.text.close", {
            initialValue: !newConfig && mail.mailOptions.text.close || ""
          })(
            <Input placeholder="eg. Thanks," style={{ width: 330 }} />
          )}
        </Form.Item>

        <Form.Item>
          <Button loading={loading} htmlType={"submit"} type="primary">Save</Button>
        </Form.Item>

      </Form>
    </div>
  )
}

const mapStateToProps = state => ({ config: state.config });

const WrappedVerifyEmail = Form.create({ name: "verify-email-config" })(VerifyEmailConfig);

export default connect(mapStateToProps, { setConfig, updateMailConfig })(WrappedVerifyEmail);