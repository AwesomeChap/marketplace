import React, { useEffect, useState } from 'react';
import { LiteTitle } from '../../Helper/ChoiceCards';
import { connect } from 'react-redux';
import { Button, Modal, Form, Input, Collapse, Icon, message } from 'antd';
import { setConfig } from '../../../redux/actions/actions';
import uuidv4 from 'uuid/v4';
import axios from 'axios';
import Loader from '../../Helper/Loader';

const { Panel } = Collapse;

const LinksForm = (props) => {
  const { form } = props;
  const { getFieldDecorator, setFieldValue, validateFields } = form;

  const LinksFormOptions = {
    rules: [{ required: true, message: "required!" }]
  }

  const handleSaveLinks = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (!props.link) {
          values = { ...values, key: uuidv4() };
        }
        else {
          values = { ...values, key: props.link.key }
        }
        props.handleSaveLinks(values);
      }
    })
  }

  return (
    <Form onSubmit={handleSaveLinks}>
      <Form.Item label="Name">
        {getFieldDecorator("name", {
          ...LinksFormOptions,
          initialValue: !!props.link ? props.link.name : undefined
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="Url">
        {getFieldDecorator("url", {
          ...LinksFormOptions,
          initialValue: !!props.link ? props.link.url : undefined
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

const WrappedLinksForm = Form.create({ name: "Links" })(LinksForm);

const Links = (props) => {
  const [visible, setVisible] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = (data) => {
    setLoading(true);
    axios.post('/config', { prop: "links", values: data, userId: props.user._id }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, links: data.config };
      props.setConfig(updatedConfig);
      setVisible(false);
      setCurrentLink(null);

      return message.success(data.message);
    }).catch((e) => {
      return message.error(e.message);
    })
  }

  const handleSaveLinks = (value) => {
    let dataClone = [...props.config.links];
    if (!!currentLink) {
      const index = props.config.links.indexOf(currentLink);
      dataClone[index] = value;
    }
    else {
      dataClone = [...dataClone, value];
    }
    postData(dataClone);
  }

  const handleDeleteLinks = (key) => {
    const updatedLinks = [...props.config.links].filter((d) => d.key !== key);
    postData(updatedLinks);
  }

  const handleEditLinks = (key) => {
    const link = [...props.config.links].find(el => el.key == key);
    console.log(link);
    setCurrentLink(link);
    setVisible(true);
  }

  return (
    <Loader loading={loading}>
      <div className="menu-item-page center-aligned-flex">
        <LiteTitle title="Links" />
        <Button onClick={() => setVisible(true)} size="large" shape="round" type="primary" icon="plus">Add</Button>
        <Modal width={700} visible={visible} centered={true} footer={null} onCancel={() => setVisible(false)}
          maskClosable={false} destroyOnClose={true} title={!!currentLink ? "Edit Link" : "Create Link"} >
          <WrappedLinksForm loading={loading} handleSaveLinks={handleSaveLinks} link={currentLink} />
        </Modal>
        <Collapse style={{ width: "100%", marginTop: 16 }}>
          {props.config.links.map((d) => {

            const operations = (
              <>
                <Icon onClick={() => handleEditLinks(d.key)} style={{ paddingRight: 16, paddingLeft: 16 }} type="edit" />
                <Icon onClick={() => handleDeleteLinks(d.key)} theme="twoTone" twoToneColor="#ff4d4f" type="delete" />
              </>
            )

            return < Panel key={d.key} header={d.name} extra={operations} >
              <Button type="link" href={d.url} target={"_blank"}>{d.url}</Button>
            </Panel>
          })}
        </Collapse>
      </div>
    </Loader>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, { setConfig })(Links);

