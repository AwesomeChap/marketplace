import React, { useState, useEffect } from 'react'
import { Form, Icon, message, Input, Button, Alert } from 'antd';
import QueueAnim from "rc-queue-anim";
import axios from 'axios';
 
const PassResetForm = (props) => {

  const [show, setShow] = useState();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setShow(true);
    return () => {
      setShow(false);
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      values.email = values.email.toLowerCase();
      if (!err) {
        if (verified) {
          setLoading(true);
          axios.post('/auth/resetPassword',values).then(({data})=>{
            setLoading(false);
            setShow(false);
            setTimeout(()=>props.showLogin(), 600)
            return message.success(data.message);
          }).catch((e) => {
            setLoading(false);
            const error = JSON.parse(JSON.stringify(e.response.data));
            return message.error(error.message);
          })
        }
        else {
          setLoading(true);
          axios.post('/auth/resendVerificationLink', { email: values.email, passReset: true }).then(({ data }) => {
            setLoading(false);
            setVerified(true);
            return message.success("Password reset token sent to your email");
          }).catch(e => {
            setLoading(false);
            const error = JSON.parse(JSON.stringify(e.response.data));
            return message.error(error.message);
          })
        }
      }
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <Form onSubmit={handleSubmit}>
      <QueueAnim
        delay={100}
        interval={50}
        ease={"easeOutCirc"}
        animConfig={[
          { opacity: [1, 0], translateY: [0, 50] },
          { opacity: [1, 0], translateY: [0, -50] }
        ]}
      >{
          show ? [
            <Form.Item key="a" >
              {getFieldDecorator('email', {
                initialValue: props.email || "",
                rules: [
                  { type: 'email', message: 'Please valid email' },
                  { required: true, message: 'Email is required!' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                  onChange={(e)=>{if(verified) setVerified(false)}}
                // disabled={verified}
                />,
              )}
            </Form.Item>,

            verified && <Form.Item key="b">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Password is required!' }]
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="New Password"
                />
              )}
            </Form.Item>,

            verified && <Form.Item key="c">
              {getFieldDecorator('token',{
                rules: [{ required: true, message: 'Token is required!' }]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Token goes here!"
                />
              )}
            </Form.Item>,

            <Form.Item key="d">
              <Button type="primary" className="center-me" htmlType={"submit"} loading={loading}>Submit</Button>
            </Form.Item>,

          ] : null
        }
      </QueueAnim>
    </Form>
  );
}

const WrappedPassResetForm = Form.create({ name: 'pass_reset' })(PassResetForm);

export default WrappedPassResetForm;