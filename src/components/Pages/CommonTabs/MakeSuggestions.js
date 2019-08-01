import React, { useState, useEffect } from 'react';
import { Select, Button, Icon, Modal, Cascader, Form, Row, Col, Input, Alert, message } from 'antd';
import _ from 'lodash';
import { LiteTitle } from '../../Helper/ChoiceCards';
import Loader from '../../Helper/Loader';
import { connect } from 'react-redux';
import { setConfig } from '../../../redux/actions/actions';
import axios from 'axios';
import UploadImage from '../../Helper/UploadImage';
import ColData from './ColData';
import GenericApprovalTable from '../../Helper/GenericApprovalTable';
import moment from 'moment';

const { Option } = Select;

const categoriesToCascaderData = (cascaderData, obj) => {
  obj.values.map((val, i) => {
    let v = {
      value: val,
      label: val
    }
    if (obj[_.camelCase(val)].values.length) {
      v["children"] = [];
      v = { ...v, children: categoriesToCascaderData(v["children"], obj[_.camelCase(val)]) }
    }
    cascaderData.push(v);
  })
  return cascaderData;
}

const MakeSuggestions = (props) => {

  const [selectedOption, setSelectedOption] = useState();
  const [visible, setVisible] = useState(false);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const { form } = props;
  const { getFieldDecorator, validateFields, getFieldValue, resetFields } = form;

  useEffect(() => {
    setLoading(true);
    axios.get(`/config?userId=${props.user._id}`).then(({ data }) => {
      props.setConfig(data.config);
      return axios.get(`/approval?userId=${props.user._id}`)
    }).then(({data}) => {
      setApprovals(data.approvals);
      setLoading(false);
    }).catch(e => setLoading(false));
  }, [])

  useEffect(() => {
    if (props.config !== null) {
      setCategoryOptions(categoriesToCascaderData([], props.config.categories));
    }
  }, [props.config])

  const handleSuggestion = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const value = {
          userId: props.user._id,
          option: _.startCase(Object.keys(values)[0]),
          data: { ...values[Object.keys(values)[0]] },
          date: moment(new Date().valueOf()).format(`DD/MM/YYYY hh:mm A`),
        }
        if(value.option === "Categories"){
          value.data.values = [];
        }
        setLoading(true);
        axios.post('/approval', { value }).then(({ data }) => {
          setLoading(false);
          setApprovals([...approvals, {...data.approval, key: data.approval._id}]);
          setVisible(false);
          setSelectedOption(undefined);
          return message.success(data.message);
        }).catch(e => {setLoading(false); message.error(e.message)});
      }
    })
  }

  const onChange = (value) => {
    setSelectedOption(value);
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const options = ["Categories", "Ingredients", "Flavours", "Spice Levels", "Allergy", "Serve Time"].map((opt) => (
    <Option key={`${_.camelCase(opt)}`} value={_.camelCase(opt)}>{opt}</Option>
  ))

  const formItemOptions = {
    rules: [{ required: true, message: "required" }]
  }

  const component = {
    categories: selectedOption === "categories" && (
      <>
        <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}><Alert message="In case of a 0 Level sub-category suggestion, Please leave root empty" type="info" closable /></Form.Item>
        <Form.Item label={"Root"}>{getFieldDecorator("categories.values")(<Cascader placeholder="Please select a root" options={categoryOptions} changeOnSelect expandTrigger="hover" />)}</Form.Item>
        <Form.Item label={"Sub-category"}>{getFieldDecorator("categories.subCategory", formItemOptions)(<Input placeholder="eg. Indian" />)}</Form.Item>
      </>
    ),
    ingredients: selectedOption === "ingredients" && (
      <>
        <Form.Item label="Name">{getFieldDecorator("ingredients.name", formItemOptions)(<Input placeholder="eg. Tomato" />)}</Form.Item>
        <UploadImage label="Image" form={form} limit={1} name="ingredients.image" options={formItemOptions} />
        <Form.Item label="Type">{getFieldDecorator("ingredients.type", formItemOptions)(<Select placeholder="eg. Veg"><Option value={"Veg"}>Veg</Option><Option value={"Non Veg"}>Non Veg</Option></Select>)}</Form.Item>
        <Form.Item label="Description">{getFieldDecorator("ingredients.description", formItemOptions)(<Input.TextArea placeholder="Text goes here..." />)}</Form.Item>
      </>
    ),
    flavours: selectedOption === "flavours" && (
      <>
        <Form.Item label="Name">{getFieldDecorator("flavours.name", formItemOptions)(<Input placeholder="eg. Sour" />)}</Form.Item>
        <Form.Item label="Description">{getFieldDecorator("flavours.description", formItemOptions)(<Input.TextArea placeholder="Text goes here..." />)}</Form.Item>
      </>
    ),
    spiceLevels: selectedOption === "spiceLevels" && (
      <>
        <Form.Item label="Name">{getFieldDecorator("spiceLevels.name", formItemOptions)(<Input placeholder="eg. Moderate" />)}</Form.Item>
        <UploadImage label="Image" form={form} limit={1} name="spiceLevels.image" options={formItemOptions} />
      </>
    ),
    allergy: selectedOption === "allergy" && <Form.Item label="Name">{getFieldDecorator("allergy.name", formItemOptions)(<Input placeholder="eg. Egg allergy" />)}</Form.Item>,
    serveTime: selectedOption === "serveTime" && <Form.Item label="Name">{getFieldDecorator("serveTime.name", formItemOptions)(<Input placeholder="eg. Dinner" />)}</Form.Item>
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

  return (
    <Loader loading={loading}>
      <div className="menu-item-page">
        <div className="center-aligned-flex">
          <LiteTitle title="Make Suggestions" />
          <div className="mini-form">
            <Select
              showSearch
              size="large"
              placeholder="On what thing would you like to make a suggestion"
              optionFilterProp="children"
              onChange={onChange}
              style={{ width: 500 }}
              value={selectedOption}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {options}
            </Select>
            <Button disabled={approvals === undefined} onClick={() => setVisible(true)} size="large" type="primary">Suggest</Button>
          </div>
          <Modal title={`Make a suggestion for ${_.startCase(selectedOption)}`} width={600} visible={visible} footer={null}
            onCancel={handleCancel} centered={true} maskClosable={false} destroyOnClose={true}>
            <Form onSubmit={handleSuggestion} {...formItemLayout}>
              {component[selectedOption]}
              <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}>
                <Row type="flex" justify="center">
                  <Col>
                    <Button className="center-me" shape={"round"} size="large" loading={loading} htmlType={"submit"} type="primary">Save</Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Modal>
          <GenericApprovalTable colData={ColData} dataSource={approvals} name={"make-suggestions"} />
        </div>
      </div>
    </Loader>
  )
}

const mapStateToProps = state => state;

const WrappedMakeSuggestions = Form.create({ name: "make suggestions" })(MakeSuggestions);

export default connect(mapStateToProps, { setConfig })(WrappedMakeSuggestions);