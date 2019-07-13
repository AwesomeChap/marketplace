import React, { useState, useEffect } from 'react';
import { Popconfirm, Typography, Button, Input, Form, message, Icon } from 'antd';

import QueueAnim from 'rc-queue-anim';
const { Title } = Typography;
// add id to titles
// addition bug fix
// key rename when value name is changed

const hasChildren = (obj, nh, i) => {
  if (nh.length - 1 > i) {
    return hasChildren(obj[nh[i]], nh, i + 1);
  }
  else {
    if (obj[nh[i]] != undefined) {
      return true;
    }
    return false;
  }
}

const Value = (props) => {

  const originalValue = props.value;
  const [val, setVal] = useState(props.value);
  const [editMode, setEditMode] = useState(false);
  const [addSub, setAddSub] = useState(false);
  const [popConfirmVisibility, setPopConfirmVisibility] = useState(false);

  useEffect(() => {
    if (Array.isArray(props.value));
    setAddSub(false);
  }, [])

  const handleEdit = () => {
    setEditMode(true);
  }

  const handleDone = () => {
    setEditMode(false);
    props.handleChange(val, props.index, originalValue === val);
  }

  const handleChange = ({ target: { value } }) => {
    setVal(value);
  }

  const handleCancel = () => {
    setEditMode(false);
    setVal(originalValue);
  }

  const handleDelete = () => {
    if(hasChildren(props.obj, [...props.nameHistory, val], 0)) setPopConfirmVisibility(true);
    else props.handleDelete(props.index);
  }

  const handleYes = () => {
    props.handleDelete(props.index);
    setPopConfirmVisibility(false);
  }
  
  const handleNo = () => {
    setPopConfirmVisibility(false);
  }

  const handleAddSub = () => {
    setAddSub(true);
    console.log()
  }

  const handleHideSub = () => {
    setAddSub(false);
  }

  let indent = [];

  const indentIcon = <Icon type="ellipsis" className="subcategory-indent-icon" />

  for (var i = 0; i < props.level*2; i++) {
    indent.push(indentIcon);
  }

  const addOnBtns = editMode ? (
    <>
      <Button onClick={handleDone} ghost={true} type="primary" icon="check" />
      <Button onClick={handleCancel} ghost={true} type="danger" icon="close" />
    </>
  ) : (
      <>
        <Button onClick={handleEdit} icon="edit" />
        <Popconfirm
          title={"This action would also delete it's children"}
          visible={popConfirmVisibility}
          onConfirm={handleYes}
          onCancel={handleNo}
          okText="Continue"
          cancelText="Abort"
        >
          <Button onClick={handleDelete} type="danger" icon="delete" />
        </Popconfirm>
        <Button onClick={handleAddSub} disabled={hasChildren(props.obj, [...props.nameHistory, val], 0)} icon="apartment" />
      </>
    );

  return (
    <>
      <div className="generic-field-value-wrapper">
        {indent.map((icon, i) => <span key={`ident-icon-${props.name}-${i}`} >{icon}</span>)}
        <Input addonBefore={<span className="add-on-before" >{props.name}</span>} addonAfter={addOnBtns} onChange={handleChange} disabled={!editMode} className="value" value={val} />
      </div>
      {addSub && <GenericCrudField title={val} level={props.level + 1} values={[]} hideSub={handleHideSub} nameHistory={[...props.nameHistory, val]} name={val} handleChange={props.parentHandleChange} handleDeleteKey={props.parentHandleDeleteKey} />}
    </>
  )
}

const GenericCrudField = (props) => {

  const [inputValue, setInputValue] = useState("");

  const handleAddItemChange = ({ target: { value } }) => {
    setInputValue(value);
  }

  const handleChange = (val, index, nothinChanged) => {
    if (nothinChanged) {
      return message.info("Nothing changed!")
    }
    if (props.values.includes(val)) {
      return message.warning("This value already exists");
    }

    if (!val.replace(/ /g, "").length) {
      return message.warning("Empty input not allowed");
    }

    let updatedValues = [];
    Object.keys(props.values).forEach(key => updatedValues[key] = props.values[key]);
    
    if(updatedValues[updatedValues[index]]){
      updatedValues[val] = updatedValues[updatedValues[index]] 
      delete updatedValues[updatedValues[index]];
    }
    updatedValues[index] = val;

    props.handleChange(updatedValues, props.name, props.nameHistory);
  }

  const handleDelete = (index) => {
    let updatedValues = [];
    Object.keys(props.values).forEach(key => updatedValues[key] = props.values[key]);
    // updatedValues = updatedValues.filter((v, i) => index !== i);
    updatedValues.splice(index,1);
    props.handleChange(updatedValues, props.name, props.nameHistory);
  }

  const handleAddClick = async (e) => {
    e.preventDefault();

    if (props.values.includes(inputValue)) {
      return message.warning("This value already exists");
    }

    if (!inputValue.replace(/ /g, "").length) {
      return message.warning("Empty input not allowed");
    }

    if (props.hideSub) {
      props.hideSub();
    }
    
    let updatedValues = [];
    Object.keys(props.values).forEach(key => updatedValues[key] = props.values[key]);
    updatedValues.push(inputValue)

    props.handleChange(updatedValues, props.name, props.nameHistory);
    setInputValue("");
  }

  const dynamicTitle = props.name;

  let indent = [];

  const indentIcon = <Icon type="ellipsis" className="subcategory-indent-icon" />

  for (var i = 0; i < props.level*2; i++) {
    indent.push(indentIcon);
  }

  return (
    <div className={props.level == 0 ? "" : "generic-field-wrapper"} key={props.name + "-wrapper-div"}>
      {props.level == 0 && (
        <Title level={3} >
          {dynamicTitle}
          {/* <Icon className="title-icon" key={props.name + "-delete-btn"}
            onClick={() => props.handleDeleteKey(props.name)} theme="twoTone" twoToneColor="#ff4d4f" type="delete" /> */}
        </Title>
      )}
      <div className="category-values" >
        {/* <QueueAnim type="scale"> */}
        {Object.keys(props.values).map((Key, i) => {
          if (typeof props.values[Key] === "object" && Array.isArray(props.values[Key])) {
            return <GenericCrudField obj={props.obj} handleDeleteKey={props.handleDeleteKey}
              title={Key} level={props.level + 1} values={props.values[Key]} name={Key}
              handleChange={props.handleChange} nameHistory={[...props.nameHistory, Key]} />
          }
          else {
            return <Value name={props.name} key={props.name + "-" + props.values[Key]} index={i}
              nameHistory={props.nameHistory} value={props.values[Key]} handleChange={handleChange}
              parentHandleDeleteKey={props.handleDeleteKey} parentHandleChange={props.handleChange}
              level={props.level} handleDelete={handleDelete} obj={props.obj} />
          }
        })}
        <Form key={props.name + "-button"} className="generic-field-value-wrapper" layout={"inline"} style={{ width: "100%" }} onSubmit={handleAddClick}>
          {indent.map((icon) => icon)} <Input placeholder={`Enter some thing related to ${props.name}`} addonBefore={<span className="add-on-before" >{props.name}</span>} addonAfter={<Button htmlType="submit" type="primary" icon="plus"></Button>} style={{ width: "100%" }} value={inputValue} onChange={handleAddItemChange} />
        </Form>
      </div>
    </div>
  )
}

export default GenericCrudField;

