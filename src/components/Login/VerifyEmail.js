import React, { useState, useEffect } from 'react'
import { Form, Icon, message, Input, Button, Divider } from 'antd';
import QueueAnim from "rc-queue-anim";
import axios from 'axios';

const VerifyEmailForm = (props) => {

  const [show, setShow] = useState();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [sent, setSent] = useState(false);
  const sendText = sent ? "Resend" : "Send";

  useEffect(() => {
    setShow(true)
    if (props.email) {
      setSent(true);
      setLoading2(true);
      axios.post('/auth/resendVerificationLink', { email: props.email }).then(({ data }) => {
        setLoading2(false);
        return message.success(data.message);
      }).catch(e => {
        setLoading2(false);
        const error = JSON.parse(JSON.stringify(e.response.data));
        return message.error(error.message);
      })
    }
    return () => {
      setShow(false);
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!values.token) {
        return message.warning("Token is required");
      }
      else {
        setLoading(true);
        axios.post('/auth/confirmation', values).then(({ data }) => {
          setLoading(false);
          // if in middle of pass reset redirect to passReset screen
          // code ...
          // else redirect to login
          setShow(false);
          setTimeout(() => props.showLogin(), 600);
          return message.success(data.message);
        }).catch(e => {
          setLoading(false);
          const error = JSON.parse(JSON.stringify(e.response.data));
          if (error.type == "info") return message.info(error.message);
          return message.error(error.message);
        })
      }
    });
  };

  const handleResendClick = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!values.email) {
        return message.warning("Email is required");
      }
      else {
        setLoading2(true);
        axios.post('/auth/resendVerificationLink', values).then(({ data }) => {
          setLoading2(false);
          return message.success(data.message);
        }).catch(e => {
          setLoading2(false);
          const error = JSON.parse(JSON.stringify(e.response.data));
          if (error.type == "info") return message.info(error.message);
          return message.error(error.message);
        })
      }
    });
  }

  const { getFieldDecorator } = props.form;

  return (
    <Form >
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
                initialValue : props.email || "",
                rules: [
                  { type: 'email', message: 'Please valid email' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                />,
              )}
            </Form.Item>,

            <Form.Item key="f">
              <Button type="primary" className="center-me" disabled={loading} loading={loading2} onClick={handleResendClick} >{sendText}</Button>
            </Form.Item>,

            <Divider key="e">OR</Divider>,

            <Form.Item key="b">
              {getFieldDecorator('token')(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Token goes here!"
                />
              )}
            </Form.Item>,
            <Form.Item key="d">
              <Button type="primary" className="center-me" disabled={loading2} loading={loading} onClick={handleSubmit} >Submit</Button>
            </Form.Item>,

          ] : null
        }
      </QueueAnim>
    </Form>
  );
}

const WrappedVerifyEmailForm = Form.create({ name: 'email_verify' })(VerifyEmailForm);

export default WrappedVerifyEmailForm;