import React, { useState, useEffect } from 'react'
import { Form, Icon, Tooltip, message, Input, Button, Divider, Checkbox, Modal } from 'antd';
import QueueAnim from "rc-queue-anim";
import axios from 'axios';

const SignupForm = (props) => {
  const [show, setShow] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisibile] = useState(false);

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
        // console.log('Received values of form: ', values);
        // values.email = values.email.toLowerCase();
        setLoading(true);
        axios.post('/auth/signup', values).then(({ data }) => {
          setLoading(false);
          setShow(false);
          setTimeout(() => props.showVerifyEmail(values), 600);
          return message.success(data.message);
        }).catch(e => {
          setLoading(false);
          const error = JSON.parse(JSON.stringify(e.response.data));
          return message.error(error.message);
        });
      }
    });
  };

  const handleAlreadyUserClick = () => {
    setShow(false);
    setTimeout(() => props.showLogin(), 600);
  }

  const { getFieldDecorator, setFieldsValue } = props.form;

  const passwordInfo = <span>Password must be min. 8 characters long, must include one or more special character, uppercase and lowercase alphabet</span>

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
            <Form.Item key="acceptTermsAndConditions">
              {getFieldDecorator('acceptTermsAndConditions', {
                valuePropName: 'checked',
                rules: [{ required: true, message: "Please accept terms and conditions" }]
              })(<Checkbox> <Button onClick={() => setVisibile(true)} type="link">Accept Terms & Conditions</Button> </Checkbox>)}
            </Form.Item>,
            <Form.Item key="d" >
              <Button type="primary" loading={loading} htmlType="submit" className="center-me" >Sign up</Button>
            </Form.Item>,
            <Divider key="e" >OR</Divider>,
            <Form.Item key="f" >
              <Button type="primary" disabled={loading} onClick={handleAlreadyUserClick} ghost={true} className="center-me" >Already registered?</Button>
            </Form.Item>,
          ] : null
        }
      </QueueAnim>
      <Modal
        title="Terms & Conditions"
        visible={visible}
        okText={"Accept"}
        centered={true}
        cancelText={"Reject"}
        onOk={() => { setVisibile(false); setFieldsValue({ acceptTermsAndConditions: true }) }}
        onCancel={() => { setVisibile(false); setFieldsValue({ acceptTermsAndConditions: false }) }}
      >
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, natus ex voluptate explicabo, molestias nihil nostrum minus temporibus quidem excepturi laudantium sunt repellendus perferendis at deserunt nemo facilis sit dolorem necessitatibus. Ipsa deleniti nam ratione? Similique fuga repellendus quisquam ab sapiente harum, unde dolores facilis saepe nemo odio assumenda non in dicta. Laudantium expedita tempora iure consectetur nulla! Facere, sit quae at porro iure dolorum omnis quod id! Impedit, sint aliquid ad nobis porro harum vero. Quidem nisi et dolorem temporibus nostrum fuga eum, dolores quibusdam provident saepe error eos beatae repudiandae cum reprehenderit possimus, laudantium tempore nihil quisquam mollitia!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, porro! Obcaecati saepe id tempora? Laboriosam odit autem nihil minus neque ipsam ipsum quam, vero numquam deserunt? Consectetur consequuntur non est laboriosam necessitatibus. Nesciunt, eaque veritatis, atque perferendis, quibusdam dolores aperiam sint officiis maxime voluptas quos ex quam distinctio hic odit accusamus in voluptates ab. Ipsa corporis illo totam odit sit perspiciatis quos ex! Magni totam soluta nobis quis, autem quasi rerum sint id omnis sit adipisci ea quod ipsa numquam aperiam cumque, iste accusantium quidem culpa quae consequuntur, ullam repudiandae perspiciatis porro? Vel consequuntur ad est harum odio alias laudantium!</p>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem obcaecati vitae nihil hic nemo doloremque veniam at quaerat expedita magnam! Delectus ex culpa ratione minima nesciunt! Laborum maxime incidunt cum laudantium, nisi minus similique sunt. Inventore, deleniti, sed aut repellat, ullam quasi modi autem nulla repudiandae ipsam quos animi doloribus?</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit enim rerum explicabo ea, ut dolore optio doloribus nostrum illum, vel eligendi! Nisi perferendis, porro earum nihil laboriosam culpa. Necessitatibus odit temporibus architecto ab adipisci nulla excepturi nesciunt sequi vitae! Accusamus, corrupti vitae explicabo accusantium sed id nemo eos culpa magnam officia eius doloribus impedit, reprehenderit eum at aliquid saepe tenetur nostrum quisquam quam delectus doloremque ullam, ad autem. Nesciunt dolore aspernatur hic reprehenderit illo numquam rerum alias, blanditiis ipsum id reiciendis aut praesentium, voluptate cupiditate error nostrum, repellendus exercitationem officiis. Exercitationem quia qui similique error minus eos deleniti ipsam maxime.</p>
      </Modal>
    </Form>
  );
}

const WrappedSignupForm = Form.create({ name: 'normal_signup' })(SignupForm);

export default WrappedSignupForm;