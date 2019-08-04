import React, { useEffect, useState } from 'react';
import { LiteTitle } from '../../Helper/ChoiceCards';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, Collapse, Icon, message } from 'antd';
import { setConfig } from '../../../redux/actions/actions';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import Loader from '../../Helper/Loader';

const { Panel } = Collapse;

const FAQForm = (props) => {
  const { form } = props;
  const { getFieldDecorator, setFieldValue, validateFields } = form;

  const faqFormOptions = {
    rules: [{ required: true, message: "required!" }]
  }

  const handleSaveFAQ = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (!props.faq) {
          values = { ...values, key: uuidv4() };
        }
        else{
          values = {...values, key : props.faq.key}
        }
        props.handleSaveFAQ(values);
      }
    })
  }

  return (
    <Form onSubmit={handleSaveFAQ}>
      <Form.Item label="Question">
        {getFieldDecorator("question", {
          ...faqFormOptions,
          initialValue: !!props.faq ? props.faq.question : undefined
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="Answer">
        {getFieldDecorator("answer", {
          ...faqFormOptions,
          initialValue: !!props.faq ? props.faq.answer : undefined
        })(
          <Input.TextArea />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={props.loading} htmlType="submit">Save</Button>
      </Form.Item>
    </Form>
  )
}

const WrappedFAQForm = Form.create({ name: "faq" })(FAQForm);

const FAQ = (props) => {
  const [visible, setVisible] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = (data) => {
    setLoading(true);
    axios.post('/config', { prop: "faq", values: data, userId: props.user._id }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, faq: data.config };
      props.setConfig(updatedConfig);
      setVisible(false);
      setCurrentFaq(null);

      return message.success(data.message);
    }).catch((e) => {
      return message.error(e.message);
    })
  }

  const handleSaveFAQ = (value) => {
    let dataClone = [...props.config.faq];
    if (!!currentFaq) {
      const index = props.config.faq.indexOf(currentFaq);
      dataClone[index] = value;
    }
    else {
      dataClone = [...dataClone, value];
    }
    postData(dataClone);
  }

  const handleDeleteFAQ = (key) => {
    const updatedFaqs = [...props.config.faq].filter((d) => d.key !== key);
    postData(updatedFaqs);
  }

  const handleEditFAQ = (key) => {
    const faq = [...props.config.faq].find(el => el.key == key);
    console.log(faq);
    setCurrentFaq(faq);
    setVisible(true);
  }

  return (
    <Loader loading={loading}>
      <div className="menu-item-page center-aligned-flex">
        <LiteTitle title="FAQ" />
        <Button onClick={() => setVisible(true)} size="large" shape="round" type="primary" icon="plus">Add</Button>
        <Modal width={700} visible={visible} centered={true} footer={null} onCancel={() => setVisible(false)}
          maskClosable={false} destroyOnClose={true} title={!!currentFaq ? "Edit FAQ" : "Create FAQ"} >
          <WrappedFAQForm loading={loading} handleSaveFAQ={handleSaveFAQ} faq={currentFaq} />
        </Modal>
        <Collapse style={{ width: "100%", marginTop: 16 }}>
          {props.config.faq.map((d) => {

            const operations = (
              <>
                <Icon onClick={() => (d.key)} style={{ paddingRight: 16, paddingLeft: 16 }} onClick={() => handleEditFAQ(d.key)} type="edit" />
                <Icon onClick={() => handleDeleteFAQ(d.key)} theme="twoTone" twoToneColor="#ff4d4f" type="delete" />
              </>
            )

            return < Panel key={d.key} header={d.question} extra={operations} >
              {d.answer}
            </Panel>
          })}
        </Collapse>
      </div>
    </Loader>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setConfig })(FAQ);

