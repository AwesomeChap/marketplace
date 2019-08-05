import React, { useState, useEffect } from 'react';
import { Statistic, Card, Row, Col, Icon, message, Button, Form, Modal, Select, Input, Badge } from 'antd';
import { LiteTitle } from '../../Helper/ChoiceCards';
import Loader from '../../Helper/Loader';
import axios from 'axios';
import { connect } from 'react-redux';
import UploadImage from '../../Helper/UploadImage';
import moment from 'moment';

// const Option = Select;

const Advertise = (props) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adPricing, setAdPricing] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const { form } = props;
  const { getFieldDecorator, validateFields, getFieldValue, resetFields } = form;

  useEffect(() => {
    setLoading(true);
    axios.get(`/config?userId=${props.user._id}&prop=advertisement`).then(({ data }) => {
      setAdPricing(data.config.addPricing.values);
      setLoading(false);
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) });
  }, [])

  const handleAdd = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (!selectedAd || selectedAd.visibility !== values.visibility) {
          const time_stamp = new Date().valueOf();
          let startDate = moment(time_stamp).format("DD/MM/YYYY hh:mm A");
          let endDate = moment(time_stamp).add(values.duration.key, "months").format("DD/MM/YYYY hh:mm A");

          values["startDate"] = startDate;
          values["endDate"] = endDate;
        }

        //duration change to be handled

        // else if(selectedAd.duration !== values.duration){
        //   values["endDate"]
        // }

        setSelectedAd(values);
        setVisible(false);
      }
    })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 15 },
    },
  };

  const options = {
    rules: [{ required: true, message: "Required!" }]
  }

  const durationOptions = [{ key: 1, label: "1 month" }, { key: 2, label: "2 months" }, { key: 3, label: "3 months" }, { key: 6, label: "6 months" }, { key: 12, label: "1 year" }]

  return (
    <Loader loading={loading}>
      <div className="menu-item-page">
        <div className="center-aligned-flex">
          <LiteTitle title="Advertise" />
          <Modal width={600} visible={visible} footer={null} title={!!selectedAd ? "Edit Preferences" : "Advertise Something"}
            onCancel={() => setVisible(false)} centered={true} maskClosable={false} destroyOnClose={true}>
            <Form onSubmit={handleAdd} {...formItemLayout}>
              <UploadImage limit={2} form={form} label={"Photo(s)"} name="photos" layout={formItemLayout} options={{
                initialValue: !!selectedAd ? selectedAd.photos : undefined, ...options
              }} />
              <Form.Item label="Plan">
                {getFieldDecorator("visibility", { initialValue: !!selectedAd ? selectedAd.visibility : undefined, ...options })(
                  <Select placeholder="Select appropriate plan">
                    {adPricing.map((ap) => <Select.Option key={`${ap.visibility}-option`} value={ap.visibility}>{ap.visibility}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
              {!!selectedAd && (
                <>
                  <Form.Item label="Start Date">{selectedAd.startDate}</Form.Item>
                  <Form.Item label="End Date">{selectedAd.endDate}</Form.Item>
                </>
              )}
              <Form.Item label="Duration">
                {getFieldDecorator("duration", { initialValue: !!selectedAd ? selectedAd.duration : undefined, ...options })(
                  <Select labelInValue placeholder="Select appropriate plan">
                    {durationOptions.map((duration) => <Select.Option key={`duration-${duration.key}`} value={duration.key}>{duration.label}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Cost">
                <Statistic valueStyle={{ color: '#3f8600' }} value={getFieldValue("visibility") ? adPricing.find(el => el.visibility === getFieldValue("visibility")).price : 0} precision={2} suffix={"/ month"} prefix="£" />
              </Form.Item>
              <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}>
                <Row type="flex" justify="center">
                  <Col>
                    <Button className="center-me" shape={"round"} size="large" loading={loading} htmlType={"submit"} type="primary">Save</Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Modal>
          <div className="space-evenly">
            {
              adPricing.map((ap) => {
                const spanValue = 24 / adPricing.length;
                return (
                  <div key={`${ap.visibility}-card`} style={{ margin: 20 }}>
                    <Badge count={selectedAd && selectedAd.visibility === ap.visibility ? <Icon type="check-circle" theme="filled" style={{ color: '#52c41a', fontSize: '24px' }} /> : 0}>
                      <Card style={{ width: 180, boxShadow: "0px 0px 10px #bbb" }}>
                        <Statistic
                          title={ap.visibility}
                          value={ap.price}
                          precision={2}
                          prefix={"£"}
                          valueStyle={selectedAd && selectedAd.visibility === ap.visibility ? {color: '#52c41a' } : null}
                          suffix="/ month"
                        />
                      </Card>
                    </Badge>
                  </div>
                )
              })
            }
          </div>
          <Button onClick={() => setVisible(true)} type="primary" size="large" shape="round">{!!selectedAd ? "Edit Preferences" : "Get Started"}</Button>
        </div>
      </div>
    </Loader>
  )
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Form.create({ name: "advertise" })(Advertise));