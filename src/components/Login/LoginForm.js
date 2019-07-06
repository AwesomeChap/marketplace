import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import { Form, Icon, Popover, Tooltip, Checkbox, message, Input, Button, Divider, Modal } from 'antd';
import QueueAnim from "rc-queue-anim";
import axios from 'axios';
import { connect } from 'react-redux';
import { saveUser } from '../../redux/actions/actions';

const NormalLoginForm = (props) => {

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
        setLoading(true);
        axios.post('/auth/login', values).then(({ data }) => {
          setLoading(false);
          props.saveUser(data.user);
          props.handleCancel();
          return message.success(data.message);
        }).catch(e => {
          setLoading(false);
          if(JSON.stringify(e.response.status) == 400){
            return message.error(JSON.parse(JSON.stringify(e.response.data.message)));
          }
          return message.error(e.message);
        })
      }
    });
  };

  const handleNewUserClick = () => {
    setShow(false);
    setTimeout(() => props.showSignup(), 900);
  }

  const { getFieldDecorator } = props.form;

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
      >{
          show ? [
            <Form.Item key="a" >
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Please enter your email id!' },
                  { type: 'email', message: 'Please valid email' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                />,
              )}
            </Form.Item>,
            <Form.Item key="b">
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please enter your password!' }
                ],
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"

                />
              )}
            </Form.Item>,
            <Form.Item key="c">
              <div className="space-between">
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox>Remember me</Checkbox>)}
                <a href="">Forgot password?</a>
              </div>
            </Form.Item>,
            <Form.Item key="d">
              <div className="space-between">
                <Button type="primary" onClick={handleNewUserClick} ghost={true}>New User?</Button>
                <Button type="primary" loading={loading} htmlType="submit" >Log in</Button>
              </div>
            </Form.Item>,
            <Divider key="e">OR</Divider>,
            <Form.Item key="f">
              <div className="space-between">
                <Button size="large" shape="circle" type="primary"
                  // style={{backgroundColor:"rgb(226, 0, 0)"}} 
                  className="center-me" ><i className="fab fa-google" /></Button>
                <Button size="large" shape="circle" type="primary"
                  // style={{backgroundColor:"#3b5998"}} 
                  className="center-me" ><i className="fab fa-facebook-f" /></Button>
                <Button size="large" shape="circle" type="primary"
                  // style={{backgroundColor:"#0077B5"}} 
                  className="center-me" ><i className="fab fa-linkedin-in" /></Button>
              </div>
            </Form.Item>
          ] : null
        }
      </QueueAnim>
    </Form>
  );
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default connect(null, {saveUser})(WrappedNormalLoginForm);