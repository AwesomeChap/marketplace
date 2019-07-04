import React, { useState, useEffect } from 'react'
import { Form, Icon, Popover, Tooltip, message, Input, Button, Divider, Modal } from 'antd';
import QueueAnim from "rc-queue-anim";
import axios from 'axios';

const SignupForm = (props) => {
  const [show, setShow] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(true)
    return () => {
      setShow(false);
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        // props.handleCancel();
        console.log('Received values of form: ', values);
        setLoading(true);
        axios.post('/auth/signup', values).then(({data}) => {
          setLoading(false);
          if(data.error){
            return message.warning(data.error);
          }
          props.showLogin();
          return message.success(data.message);
        }).catch(e =>{
          setLoading(false);
          console.log(e);
          return message.error(e.message);
        });
      }
    });
  };

  const handleAlreadyUserClick = () => {
    setShow(false);
    setTimeout(() => props.showLogin(), 900);
  }

  const { getFieldDecorator } = props.form;

  const passwordInfo = <span>Password must be min. 8 characters long, must include one or more special character, uppercase and lowercase alphabet</span>

  return (
    <Form style={{ height: 330 }} onSubmit={handleSubmit}>
      <QueueAnim
        delay={100}
        interval={50}
        ease={"easeOutCirc"}
        animConfig={[
          { opacity: [1, 0], translateY: [0, 50] },
          { opacity: [1, 0], translateY: [0, -50] }
        ]}
      >
        {
          show ? [
            <div className="inline-form" key="a">
              <Form.Item>
                {getFieldDecorator('name.first', {
                  rules: [
                    { required: true, message: 'First name required!' },
                  ],
                })(
                  <Input
                    prefix={<Icon type="solution" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="First Name"
                  />,
                )}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('name.last', {
                rules: [
                  { required: true, message: 'Last name required!' },
                ],
              })(
                <Input
                  prefix={<Icon type="solution" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Last Name"
                />,
              )}
            </Form.Item>
            </div>,
            <Form.Item key="b" >
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please valid email' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                />,
              )}
            </Form.Item>,
            <Form.Item key="c" >
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                  suffix={
                    <Tooltip title={passwordInfo}>
                      <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                  }
                />
              )}
            </Form.Item>,
            <Form.Item key="d" >
              <Button type="primary" loading={loading} htmlType="submit" className="center-me" >Sign up</Button>
            </Form.Item>,
            <Divider key="e" >OR</Divider>,
            <Form.Item key="f" >
              <Button type="primary" onClick={handleAlreadyUserClick} ghost={true} className="center-me" >Already registered?</Button>
            </Form.Item>,
          ] : null
        }
      </QueueAnim>
    </Form>
  );
}

const WrappedSignupForm = Form.create({ name: 'normal_signup' })(SignupForm);

export default WrappedSignupForm;