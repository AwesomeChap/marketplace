import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Switch, Button, TimePicker, Row, Col, AutoComplete, Icon } from 'antd';
import UploadImage from '../../Helper/UploadImage';
import moment from 'moment';
import Loader from '../../Helper/Loader';
import axios from 'axios';

const { Option } = Select;

const SellerProfile = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { form } = props;
  const { getFieldDecorator, getFieldValue, validateFields } = form;

  useEffect(() => {
    setLoading(true);
    let encodedText = encodeURIComponent(getFieldValue("address"));
    if (encodedText === "undefined") encodedText = "";
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedText}.json?access_token=pk.eyJ1IjoiYXdlc29tZWNoYXAiLCJhIjoiY2p6NGxuYzV4MDM0NjNmdDQxNm5vd3RlZiJ9.fnHf3fB5ddaANEfKiqYrAQ&cachebuster=1565433849624&autocomplete=true`)
      .then(({ data }) => {
        if (data.features) {
          setData(data.features);
          // console.log(data.features);
        } else {
          setData([]);
        }
        setTimeout(() => setLoading(false), 1000);
      })
      .catch(e => {
        setLoading(false);
        setData([]);
      });
  }, [getFieldValue("address")]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        values["openingTime"] = values["openingTime"].format('hh:mm A');
        values["closingTime"] = values["closingTime"].format('hh:mm A');
        props.handleSaveConfig(values, "profile", props.branchId, props.done);
      }
    })
  }

  const onSelect = (value, option) => {
    console.log(option.props.fullAddr);
  };

  const addressOptions = data.length ? data.map(d => (
    <AutoComplete.Option key={d.id} label={d.text} value={d.place_name} style={{ whiteSpace: "normal" }} fullAddr={{
      id: d.id,
      name: d.text,
      address: d.place_name,
      location: {
        longitude: d.geometry.coordinates[0],
        latitude: d.geometry.coordinates[1]
      }
    }}
    >
      <h3>{d.text}</h3>
      <p>{d.place_name}</p>
    </AutoComplete.Option>
  )) : null;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  const services = ["Dinning In", "Take Away", "Delivery"];
  const modeOfService = ["Food is delivered", "Service personnel"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // const newConfig = Object.keys(sellerConfig).length == 1;
  const newConfig = !props.branchId;

  let profile;

  (!newConfig && props.sellerConfig.branches.length) ? profile = props.sellerConfig.branches.filter(branch => branch._id == props.branchId)[0].profile : undefined;

  return (
    <>
      <Form style={{ position: "relative" }} {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="Branch Name" >
          {getFieldDecorator('branchName', {
            rules: [{ required: true, message: "Branch name is required!" }],
            initialValue: newConfig ? undefined : profile.branchName
          })(<Input placeholder="Branch Name" />)}
        </Form.Item>

        <Form.Item label="Address">
          {getFieldDecorator("address", {
            rules: [{ required: true, message: "Branch name is required!" }],
            initialValue: newConfig ? undefined : profile.address
          })(
            <AutoComplete style={{ width: "100%" }} dataSource={addressOptions} placeholder="Please input an address" onSelect={onSelect} optionLabelProp="value">
              <Input allowClear={true} 
                // suffix={<Icon type={loading ? "loading" : "search"} />} 
              />
            </AutoComplete>
          )}
        </Form.Item>

        <Form.Item label="Opening Time">
          {getFieldDecorator('openingTime', {
            rules: [{ required: true, message: "Opening time is required" }],
            initialValue: newConfig ? moment('10:00', 'hh:mm A') : moment(profile.openingTime, 'hh:mm A')
          })(<TimePicker format='hh:mm A' />)}
        </Form.Item>

        <Form.Item label="Closing Time">
          {getFieldDecorator('closingTime', {
            rules: [{ required: true, message: "Closing time is required" }],
            initialValue: newConfig ? moment('22:00', 'hh:mm A') : moment(profile.closingTime, 'hh:mm A')
          })(<TimePicker format='hh:mm A' />)}
        </Form.Item>

        <Form.Item label="Closing Days">
          {getFieldDecorator('closingDays', {
            initialValue: newConfig ? undefined : profile.closingDays
          })(
            <Select mode="multiple" placeholder="Please let us know which days are you closed">
              {days.map((day, i) => <Option value={day} key={i + 1}>{day}</Option>)}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Cost For One">
          {getFieldDecorator('costForOne', {
            initialValue: newConfig ? undefined : profile.costForOne,
            rules: [{ type: "number", message: "Input should be a number." },{ required: true, message: "Cost for one is required!" }]
          })(<InputNumber min={0} formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\£\s?|(,*)/g, '')} placeholder="price" />)}
        </Form.Item>

        <Form.Item label="Offers">
          {getFieldDecorator('offers', {
            initialValue: newConfig ? undefined : profile.offers
          })(
            <Select mode="tags" placeholder="Please select available service options" dropdownStyle={{ display: "none" }} />
          )}
        </Form.Item>

        <Form.Item label="Available Services">
          {getFieldDecorator('serviceOptions', {
            rules: [{ required: true, message: "Services are required!" }],
            initialValue: newConfig ? undefined : profile.serviceOptions
          })(
            <Select mode="multiple" placeholder="Please select available service options">
              {services.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
            </Select>
          )}
        </Form.Item>

        {Array.isArray(getFieldValue("serviceOptions")) && [...getFieldValue("serviceOptions")].includes("Delivery") && (
          <>
            <Form.Item label="Min Order">
              {getFieldDecorator('minOrder', {
                initialValue: newConfig ? undefined : profile.minOrder,
                rules: [{ type: "number", message: "Input should be a number." },{ required: true, message: "Min Order is required!" }]
              })(<InputNumber min={0} formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\£\s?|(,*)/g, '')} placeholder="price" />)}
            </Form.Item>

            <Form.Item label="Delivery Coverage Area">
              {getFieldDecorator('delivery.coverageArea', {
                initialValue: newConfig ? undefined : (profile.delivery.coverageArea || null),
                rules: [{ type: "number", message: "Input should be a number." },{ required: true, message: "Service coverage required if you deliver also!" }]
              })(<InputNumber min={1}
                // formatter={value => `${value}m`} parser={value => value.replace('m', '')} 
                placeholder="in Km eg. 5" />)}
            </Form.Item>

            <Form.Item label="Delivery Cost">
              {getFieldDecorator('delivery.cost', {
                initialValue: newConfig ? undefined : (profile.delivery.cost),
                rules: [{ type: "number", message: "Input should be a number." },
                { required: true, message: "Service coverage required if you deliver also!" }]
              })(<InputNumber min={0} formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\£\s?|(,*)/g, '')} placeholder="eg. 5" />)}
            </Form.Item>
          </>
        )}

        <UploadImage form={form} label="Photos" name="photos" options={{
          initialValue: newConfig ? undefined : profile.photos
        }} />

        <Form.Item label="Capacity">
          {getFieldDecorator('capacity', {
            initialValue: newConfig ? undefined : (profile.capacity || 0),
            rules: [{ type: "number", message: "Input should be a number." }, { required: true, message: "Catering service coverage required!" }]
          })(<InputNumber min={0} placeholder="Capacity of your restaurant" />)}
        </Form.Item>

        <Form.Item label="Levy">
          {getFieldDecorator('levy', {
            initialValue: newConfig ? undefined : (profile.hourlyCharge || 0),
            rules: [{ type: "number", message: "Input should be a number." },]
          })(<InputNumber min={0} formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\£\s?|(,*)/g, '')} placeholder="fine for coming late" />)}
        </Form.Item>

        <Form.Item label="Hourly Charge">
          {getFieldDecorator('hourlyCharge', {
            initialValue: newConfig ? undefined : (profile.levy || 0),
            rules: [{ type: "number", message: "Input should be a number" },]
          })(<InputNumber min={0} formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\£\s?|(,*)/g, '')} placeholder="Hour charge of table" />)}
        </Form.Item>

        <Form.Item label="Smoking Allowed">
          {getFieldDecorator('smokingAllowed', {
            initialValue: newConfig ? false : profile.smokingAllowed,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="Alcohol Allowed">
          {getFieldDecorator('alcohol.allowed', {
            initialValue: newConfig ? false : profile.alcohol.allowed,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {getFieldValue('alcohol.allowed') && (
          <Form.Item label="Alcohol Served">
            {getFieldDecorator('alcohol.served', {
              initialValue: newConfig ? false : profile.alcohol.served,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        )}

        <Form.Item label="Catering Service Available">
          {getFieldDecorator('cateringService.available', {
            initialValue: newConfig ? false : profile.cateringService.available,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {getFieldValue('cateringService.available') && (
          <>
            <Form.Item label="Catering Service Coverage Area">
              {getFieldDecorator('cateringService.coverageArea', {
                initialValue: newConfig ? undefined : (profile.cateringService.coverageArea || null),
                rules: [{ type: "number", message: "Input should be a number." }, { required: true, message: "Catering service coverage required!" }]
              })(<InputNumber min={0} placeholder="Coverage Area" />)}
            </Form.Item>

            <Form.Item label="Mode of Service">
              {getFieldDecorator('cateringService.modeOfService', {
                initialValue: newConfig ? undefined : profile.cateringService.modeOfService,
                rules: [{ required: true, message: "Mode of service is required!" }]
              })(
                <Select mode="multiple" placeholder="Please select mode of services">
                  {modeOfService.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
                </Select>
              )}
            </Form.Item>
          </>
        )}
        <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}>
          <Row type="flex" justify="center">
            <Col>
              <Button shape={"round"} size="large" loading={props.loading} htmlType={"submit"} type="primary">Save</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  )
}

export default Form.create({ name: "seller_profile" })(SellerProfile);
