import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, TreeSelect, Button, TimePicker, Row, Col } from 'antd';
import UploadImage from '../../Helper/UploadImage';
import moment from 'moment';
import Loader from '../../Helper/Loader';
import GenericPropsTable from '../../Helper/GenericPropsTable';
import ColData from './ColData';

const FoodItemModalForm = (props) => {
  const { form } = props;
  const { getFieldDecorator, validateFields, getFieldValue, resetFields } = form;
  const [ingredientsList, setIngredientsList] = useState([]);
  const [nutrientsList, setNutrientsList] = useState([]);
  const [ingsOption, setIngsOption] = useState([]);
  const [nutsOption, setNutsOption] = useState([]);

  const ingColData = ColData.ingredients;
  const nutColData = ColData.nutrition;

  useEffect(() => {
    if(!!props.foodItem){
      setIngredientsList(props.foodItem.ingredients);
      setNutrientsList(props.foodItem.nutrition);
    }
  },[])

  useEffect(() => {
    if (Object.keys(props.options).length) {
      const options = [...props.options.ingredients];
      const optionsUpdated = options.map(subOptions => ({ ...subOptions, children: subOptions.children.filter(opt => !ingredientsList.filter(ing => ing.name == opt.value)[0]) }))
      setIngsOption(optionsUpdated);
    }
  }, [ingredientsList])

  useEffect(() => {
    if (Object.keys(props.options).length) {
      const options = [...props.options.nutrition];
      const optionsUpdated = options.map(subOptions => ({ ...subOptions, children: subOptions.children.filter(opt => !nutrientsList.filter(nut => nut.name == opt.value)[0]) }))
      setNutsOption(optionsUpdated);
    }
  }, [nutrientsList])

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        values["leadTime"] = values["leadTime"].format('HH:mm');
        values = { ...values, ingredients: ingredientsList, nutrition: nutrientsList };
        delete values.addIngredient;
        delete values.addIngredientWeight;
        delete values.addNutrition;
        delete values.addNutritionWeight;
        if(props.foodItem) values["_id"] = props.foodItem._id;
        props.handleSaveFoodItem(values, props.done);
      }
    })
  }

  const handleDataChange = (name, data) => {
    if (name == "ingredients") {
      setIngredientsList(data);
    }
    else {
      setNutrientsList(data);
    }
  }

  const handleAddIngredient = (name, quantity) => {
    let item = props.ingredients.filter(ing => ing.name === name)[0];
    item = { ...item, quantity }
    setIngredientsList([...ingredientsList, item]);
  }

  const handleAddNutrition = (name, quantity) => {
    let item = props.nutrition.filter(nutrient => nutrient.name === name)[0];
    item = { ...item, quantity }
    setNutrientsList([...nutrientsList, item]);
  }

  const newConfig = !props.foodItem;

  console.log(props.foodItem);


  if (!Object.keys(props.options).length)
    return <Loader />

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
    <Loader loading={props.loading} >
      <Form onSubmit={handleSubmit} {...formItemLayout}>

        <Form.Item label="Name">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: "Name is required!" }],
            initialValue: newConfig ? undefined : props.foodItem.name
          })(<Input placeholder="name (eg. Pizza)" />)}
        </Form.Item>

        <UploadImage form={form} limit={1} label="image" name="image" options={{
          rules: [{ required: true, message: "Food Item image is required" }],
          initialValue: newConfig ? undefined : props.foodItem.image
        }} />

        <Form.Item label="Type" >
          {getFieldDecorator('type', {
            rules: [{ required: true, message: "Type is required!" }],
            initialValue: newConfig ? undefined : props.foodItem.type
          })(
            <Select placeholder="type (eg. Veg)">
              {props.options.type.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Price">
          {getFieldDecorator('price', {
            initialValue: newConfig ? 0 : (props.foodItem.price || 0),
            rules: [{ required: true, message: "Catering service coverage required!" }]
          })(<InputNumber formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\£\s?|(,*)/g, '')} placeholder="price" />)}
        </Form.Item>

        <Form.Item label="Lead Time">
          {getFieldDecorator('leadTime', {
            rules: [{ required: true, message: "Lead time is required!" }],
            initialValue: newConfig ? moment("00:30", 'HH:mm') : moment(props.foodItem.leadTime, 'HH:mm')
          })(<TimePicker format='HH:mm' />)}
        </Form.Item>

        <Form.Item label="Serve Time" >
          {getFieldDecorator('serveTime', {
            rules: [{ required: true, message: "Type is required!" }],
            initialValue: newConfig ? undefined : props.foodItem.serveTime
          })(
            <Select mode={"multiple"} placeholder="Serve Time (eg. Dinner)">
              {props.options.serveTime.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Categories" >
          {getFieldDecorator('category', {
            rules: [{ required: true, message: "Categories are required!" }],
            initialValue: newConfig ? undefined : props.foodItem.category
          })(
            <TreeSelect
              allowClear multiple
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={props.options.category}
              placeholder="Categories (eg. Indian )"
            />
          )}
        </Form.Item>

        <Form.Item label="Flavours" >
          {getFieldDecorator('flavours', {
            rules: [{ required: true, message: "Flavours are required!" }],
            initialValue: newConfig ? undefined : props.foodItem.flavours
          })(
            <Select mode={"multiple"} placeholder="Flavours (eg. Sweet)">
              {props.options.flavours.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Spice Level">
          {getFieldDecorator('spiceLevel', {
            // rules: [{ required: true, message: "Spice level is required!" }],
            initialValue: newConfig ? undefined : props.foodItem.spiceLevel
          })(
            <Select placeholder="Flavours (eg. Spicy)">
              {props.options.spiceLevel.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Allergies" >
          {getFieldDecorator('allergies', {
            initialValue: newConfig ? undefined : props.foodItem.flavours
          })(
            <Select mode={"multiple"} placeholder="Allergies (eg. Nut allergy)">
              {props.options.allergies.map((opt, i) => <Option value={opt} key={i + 1}>{opt}</Option>)}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Recipe" >
          {getFieldDecorator('recipe', {
            initialValue: newConfig ? undefined : props.foodItem.recipe
          })(<Input.TextArea rows={4} placeholder="Your awesome recipe goes here..." />)}
        </Form.Item>

        <Form.Item label="Add Ingredient" >
          <Row gutter={8}>
            <Col span={14}>
              {getFieldDecorator('addIngredient', {
                // rules: [{ required: true }],
              })(
                <TreeSelect showSearch allowClear dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={ingsOption.length ? ingsOption : props.options.ingredients} placeholder="Ingredient (eg. egg )" />
              )}
            </Col>
            <Col span={6}>
              {getFieldDecorator('addIngredientWeight', {
                initialValue: 0
              })(
                <InputNumber disabled={getFieldValue("addIngredient") == undefined || !getFieldValue("addIngredient").length}
                  formatter={value => `${value}g`} parser={value => value.replace('g', '')} />
              )}
            </Col>
            <Col span={4}>
              <Button disabled={getFieldValue("addIngredient") == undefined || !getFieldValue("addIngredient").length || getFieldValue("addIngredientWeight") == undefined}
                type="primary" onClick={() => {
                  handleAddIngredient(getFieldValue("addIngredient"), getFieldValue("addIngredientWeight"))
                  resetFields(["addIngredient", "addIngredientWeight"]);
                }} >Add</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 2 },
        }}>
          <GenericPropsTable handleDataChange={handleDataChange} addForm={false} name="ingredients" colData={ingColData} dataSource={ingredientsList} />
        </Form.Item>

        <Form.Item label="Add Nutrition" >
          <Row gutter={8}>
            <Col span={14}>
              {getFieldDecorator('addNutrition', {
                // rules: [{ required: true }],
              })(
                <TreeSelect showSearch allowClear dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={nutsOption.length ? nutsOption : props.options.nutrition} placeholder="Ingredient (eg. Vitamin A )" />
              )}
            </Col>
            <Col span={6}>
              {getFieldDecorator('addNutritionWeight', {
                initialValue: 0
              })(
                <InputNumber disabled={getFieldValue("addNutrition") == undefined || !getFieldValue("addNutrition").length}
                  formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
              )}
            </Col>
            <Col span={4}>
              <Button disabled={getFieldValue("addNutrition") == undefined || !getFieldValue("addNutrition").length || getFieldValue("addNutritionWeight") == undefined}
                type="primary" onClick={() => {
                  handleAddNutrition(getFieldValue("addNutrition"), getFieldValue("addNutritionWeight"))
                  resetFields(["addNutrition", "addNutritionWeight"]);
                }} >Add</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 2 },
        }}>
          <GenericPropsTable handleDataChange={handleDataChange} addForm={false} name="nutrition" colData={nutColData} dataSource={nutrientsList} />
        </Form.Item>
        <Form.Item wrapperCol={{xs: { span: 24 },sm: { span: 24 }}}>
          <Row type="flex" justify="center">
            <Col>
        <Button className="center-me" shape={"round"} size="large" loading={props.loading} htmlType={"submit"} type="primary">Save</Button>
        </Col>
        </Row>
        </Form.Item>
      </Form>
    </Loader >
  )
}

export default Form.create({ name: "food-items-modal-form" })(FoodItemModalForm);