import React, { useState, useEffect } from 'react';
import { Form, Typography, Divider, Select, Input, Icon, Tooltip, Button, message, notification } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { OptGroup, Option } = Select;

const VerifyEmailConfig = (props) => {

  const [mailConfig, setMailConfig] = useState();
  const [loading, setLoading] = useState(false);
  const { form } = props;
  const { getFieldDecorator } = form;

  useEffect(() => {
    axios.get(`/config/mail?userId=${props.user._id}`).then(({data})=>{
      setMailConfig(data.config);
      if(data.type == "info"){
        return message.info(data.message);
      }
      return message.success(data.message)
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      return message.error(error.message);
    })
  }, [])

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
  
    if(obj[key] === "") delete obj[key];
  
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
        axios.post('/config/mail', {values, userId : props.user._id}).then(({data}) => {
          setLoading(false);
          return message.success(data.message);
        }).catch((e) => {
          const error = JSON.parse(JSON.stringify(e.response.data));
          setLoading(false);
          return message.error(error.message);
        })
      }
    });
  }

  if(!mailConfig){
    return "loading..."
  }

  const newConfig = JSON.stringify(mailConfig) == "{}";

  return (
    <Form layout={"vertical"} {...formItemLayout} onSubmit={handleSubmit}>
      <Title id="1" level={3} >Transporter Config</Title>

      <Form.Item label="Host">
        {getFieldDecorator('smtpConfig.host', {
          initialValue: !newConfig && mailConfig.smtpConfig.host || "",
          rules: [{ required: true, message: 'Please enter a host' }],
        })(<Input placeholder="eg. smtp.gmail.com" style={{ width: 330 }} />)}
      </Form.Item>

      <Form.Item label="Port">
        {getFieldDecorator('smtpConfig.port', {
          initialValue: !newConfig && mailConfig.smtpConfig.port || undefined,
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
          initialValue: !newConfig && mailConfig.smtpConfig.auth.user || "",
          rules: [{ required: true, message: "Please enter a username" }]
        })(
          <Input placeholder="Username" style={{ width: 330 }} />
        )}
      </Form.Item>

      <Form.Item label="Password" >
        {getFieldDecorator('smtpConfig.auth.pass', {
          initialValue: !newConfig && mailConfig.smtpConfig.auth.pass || "",
          rules: [{ required: true, message: "Please enter a password" }]
        })(
          <Input type="password" placeholder="Password" style={{ width: 330 }} />
        )}
      </Form.Item>

      <Divider></Divider>

      <Title id="2" level={3} >Mail Options</Title>

      <Form.Item label="From" >
        {getFieldDecorator('mailOptions.from', {
          initialValue: !newConfig && mailConfig.mailOptions.from || "",
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
          initialValue: !newConfig && mailConfig.mailOptions.subject || ""
        })(
          <Input placeholder="eg. Activation Token Email" style={{ width: 330 }} />
        )}
      </Form.Item>

      <Form.Item label="Salutation" >
        {getFieldDecorator("mailOptions.text.salutation", {
          initialValue: !newConfig && mailConfig.mailOptions.text.salutation || ""
        })(
          <Input placeholder="eg. Hello," style={{ width: 330 }} />
        )}
      </Form.Item>

      <Form.Item label="Body" >
        {getFieldDecorator("mailOptions.text.body", {
          initialValue: !newConfig && mailConfig.mailOptions.text.body || "",
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
          initialValue: !newConfig && mailConfig.mailOptions.text.close || ""
        })(
          <Input placeholder="eg. Thanks," style={{ width: 330 }} />
        )}
      </Form.Item>

      <Form.Item>
        <Button loading={loading} htmlType={"submit"} type="primary">Save</Button>
      </Form.Item>

    </Form>
  )
}

export default Form.create({ name: "verify-email-config" })(VerifyEmailConfig);