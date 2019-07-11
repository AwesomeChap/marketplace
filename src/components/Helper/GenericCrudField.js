import React, { useState, useEffect } from 'react';
import { Divider, Typography, Button, Input, Form, message, Icon } from 'antd';

import QueueAnim from 'rc-queue-anim';
const { Title } = Typography;
// add id to titles

const Value = (props) => {

  const originalValue = props.value;
  const [val, setVal] = useState(props.value);
  const [editMode, setEditMode] = useState(false);
  const [addSub, setAddSub] = useState(false);
  const [nameHistory, setNameHistory] = useState(props.nameHistory);

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
    props.handleDelete(props.index);
  }

  const handleAddSub = () => {
    setNameHistory([...nameHistory, val]);
    setAddSub(true);
  }

  const addOnBtns = editMode ? (
    <>
      <Button onClick={handleDone} ghost={true} type="primary" icon="check" />
      <Button onClick={handleCancel} ghost={true} type="danger" icon="close" />
    </>
  ) : (
      <>
        <Button onClick={handleEdit} icon="edit" />
        <Button onClick={handleDelete} type="danger" icon="delete" />
        <Button onClick={handleAddSub} icon="apartment" />
      </>
    );

  return (
    <>
      <Input addonAfter={addOnBtns} onChange={handleChange} disabled={!editMode} className="value" value={val} />
      {addSub && <GenericCrudField nameHistory={nameHistory} title={val} values={[]} name={val} handleChange={props.parentHandleChange} />}
    </>
  )
}

const GenericCrudField = (props) => {

  
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState(props.values);

  useEffect(() => {
    props.handleChange(values, props.name, props.nameHistory);
  }, [values])

  const handleAddItemChange = ({ target: { value } }) => {
    setInputValue(value);
  }

  const handleChange = (val, index, nothinChanged) => {
    if (nothinChanged) {
      return message.info("Nothing changed!")
    }
    if (values.includes(val)) {
      return message.warning("This value already exists");
    }

    if (!val.replace(/ /g, "").length) {
      return message.warning("Empty input not allowed");
    }

    let updatedValues = [...values];
    updatedValues[index] = val;
    setValues(updatedValues);
  }

  const handleDelete = (index) => {
    let updatedValues = [...values];
    updatedValues = updatedValues.filter((v, i) => index !== i);
    setValues(updatedValues);
  }

  const handleAddClick = (e) => {
    e.preventDefault();

    if (values.includes(inputValue)) {
      return message.warning("This value already exists");
    }

    if (!inputValue.replace(/ /g, "").length) {
      return message.warning("Empty input not allowed");
    }

    setValues([...values, inputValue]);
    setInputValue("");
  }


  return (
    <div>
      <Title level={3} >{props.title}</Title>
      <div className="category-values" >
        {/* <QueueAnim type="scale"> */}
        {values.map((val, i) => {
          return <Value nameHistory={props.nameHistory} name={props.name} key={props.name + "-" + val}
            index={i} value={val} handleChange={handleChange}
            parentHandleChange={props.handleChange} handleDelete={handleDelete} />
        })}
        <Form key={props.name + "-button"} layout={"inline"} style={{ width: "30%" }} onSubmit={handleAddClick}>
          <Input addonAfter={<Button htmlType="submit" type="primary" icon="plus"></Button>} style={{ width: "100%" }} value={inputValue} onChange={handleAddItemChange} />
        </Form>
        {/* </QueueAnim> */}
      </div>
      <Divider />
    </div>
  )
}

export default GenericCrudField;