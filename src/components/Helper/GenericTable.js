import React, { useState, useEffect } from "react";
import "../../scss/table.scss";
import { Table, Input, InputNumber, Form, Button, message, Select, Switch, DatePicker, Tag } from "antd";
import CreateCategoryForm from "./CategoryConfigForm";

let typeIsSelect = false;

const AddForm = (props) => {

  const { form } = props;
  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return message.warning("fields should not be empty")
      }
      else {
        if (values.hasOwnProperty("editable") && (values.editable == true || values.editable == false)) values.editable = JSON.stringify(values.editable);
        props.handleAddition(values);
        resetFields();
      }
    })
  }


  return (
    <Form layout={"inline"} onSubmit={handleSubmit}>
      <div className="flex-inline-form">
        <Button onClick={() => resetFields()} icon="undo" />
        {props.columns.map((col, i) => {
          const inputField = {
            text: <Input placeholder={col.title} />,
            number: <InputNumber placeholder={col.title} />,
            select: <Select placeholder={col.title}>{col.type == "select" ? col.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>) : undefined}</Select>,
            switch: <Switch />,
            tagSelect: <Select disabled={!typeIsSelect} placeholder={"Only for Select field"} dropdownStyle={{ display: "none" }} mode="tags" />,
            price: <InputNumber placeholder={col.title} formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />,
            multiSelect: <Select mode="multiple" placeholder={col.title}>{col.type == "multiSelect" ? col.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>) : undefined}</Select>,
            date: <DatePicker placeholder="date" />
          }
          if (col.dataIndex == "operation") {
            return <Button htmlType={"submit"} type="primary" icon="plus" />
          }

          let options = {
            rules: [{ required: true, message: `${col.title} is required` }]
          }

          if (col.type == "switch") {
            options = { initialValue: false, valuePropName: 'checked' };
          }

          if (col.type == "tagSelect") options = {};

          return (
            <Form.Item className={col.type == "switch" && "switch-fix" || col.type == "tagSelect" && "options-fix"} label={col.title}>
              {getFieldDecorator(col.dataIndex, { ...options })(inputField[col.type])}
            </Form.Item>
          )
        })}
      </div>
    </Form >
  )
}

const handleValuesChange = (props, changedValues, allValues) => {
  if (allValues.type == "select" || allValues.type == "multiSelect") {
    typeIsSelect = true;
  }
  else {
    typeIsSelect = false;
    props.form.resetFields(["options"]);
  }
}

const WrappedAddForm = Form.create({ name: "add-form", onValuesChange: handleValuesChange })(AddForm)

const EditableContext = React.createContext();

const EditableCell = (props) => {

  const getInput = (type) => {
    if (props.inputType === "number") {
      return <InputNumber />;
    }

    else if (props.inputType === "multiSelect") {
      return <Select mode="multiple" style={{ width: "100%" }}>{props.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>)}</Select>
    }

    else if (props.inputType === "date") {
      return <DatePicker placeholder="date" />
    }

    else if (props.inputType === "price") {
      return <InputNumber formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
    }

    else if (props.inputType === "switch") {
      return <Switch />
    }

    else if (props.inputType === "tagSelect") {
      return <Select disabled={type != "select" && type != "multiSelect"} style={{ width: "100%" }} dropdownStyle={{ display: "none" }} mode="tags" />
    }

    else if (props.inputType === "select") {
      return <Select style={{ width: "100%" }}>{props.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>)}</Select>
    }
    return <Input />;
  };

  const renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = props;

    let options = {
      rules: [
        {
          required: true,
          message: `Please Input ${title}!`
        }
      ],
    };

    if (inputType === "switch") options = { valuePropName: 'checked' };
    if (inputType === "tagSelect") options = {};

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              ...options, initialValue: inputType === "switch" ? record[dataIndex] = JSON.parse(record[dataIndex]) : record[dataIndex],
            })(getInput(record["type"]))}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  return (
    <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
  );
}

const EditableTable = (props) => {
  const [data, setData] = useState(props.dataSource);
  const [editingKey, setEditingKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [name, setName] = useState(props.name);

  useEffect(() => {
    if (name != props.name) {
      setData(props.dataSource);
      setName(props.name);
      setEditingKey("");
      setSelectedRows([]);
    }
  }, [props])

  const { loading } = props;
  const columns = [
    ...props.colData,
    {
      title: "Operation",
      dataIndex: "operation",
      width: "20%",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div className="table-operation-buttons">
            <EditableContext.Consumer>
              {form => (
                <Button block type="primary" onClick={() => save(form, record.key)}>Save</Button>
              )}
            </EditableContext.Consumer>
            <Button block type="danger" ghost={true} onClick={() => cancel(record.key)} >Cancel</Button>
          </div>
        ) : (
            <div className="table-operation-buttons">
              <Button block disabled={selectedRows.length || editingKey !== '' || loading} onClick={() => edit(record.key)}>Edit</Button>
              <Button block type="danger" onClick={() => handleDelete(record.key)} disabled={selectedRows.length || loading} >Delete</Button>
            </div>
          );
      }
    }
  ];

  const isEditing = record => record.key === editingKey;

  const cancel = () => {
    setEditingKey("")
  };

  const save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return message.warning("Input fields are empty")
      }
      const newData = [...data];

      console.log('row', row);
      const index = newData.findIndex(item => key === item.key);

      console.log('index', index);
      if (index > -1) {
        const item = newData[index];
        row.editable = JSON.stringify(row.editable);

        if (row.editable == undefined) delete row.editable;
        newData.splice(index, 1, {
          ...item,
          ...row
        });

        setData(newData);
        console.log('newData edit', newData);
        setEditingKey("");
      } else {
        newData = [...newData, row];
        setData(newData);
        console.log('newData save', newData);
        setEditingKey("");
      }
    });
  }

  const edit = (key) => {
    setEditingKey(key);
  }

  const handleDelete = (key) => {
    let updatedData = [...data];
    updatedData = updatedData.filter((item) => item.key !== key);
    setData(updatedData);
  }

  const handleMultiDelete = () => {
    let keys = [...selectedRows];
    let updatedData = [...data];
    updatedData = updatedData.filter((item) => !keys.includes(item.key));

    setData(updatedData);
    setSelectedRows([]);
  }

  const onSelectedRowsChange = (selectedRows) => {
    setSelectedRows(selectedRows)
  }

  const handleAddFormData = (values) => {
    console.log(values);
    const newData = { key: data.length + 1, ...values };
    const updatedData = [...data, newData];
    console.log('add form data', updatedData);
    setData(updatedData);
  }

  const components = {
    body: {
      cell: EditableCell
    }
  };

  const cols = columns.map(col => {
    if (col.type == "multiSelect") {
      col["render"] = options => (
        <span>
          {options && options.map((opt, i) => {
            let color = i % 3 == 1 ? 'geekblue' : 'green';
            if (i % 3 == 0) {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={opt}>
                {opt.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      )
    }
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.type,
        options: (col.type === "select" || col.type === "multiSelect") ? col.options : [],
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  const rowSelection = {
    selectedRows,
    onChange: onSelectedRowsChange,
  };

  if (!props.colData.length) {
    return <CreateCategoryForm name={props.name} />
  }

  const footer = () => (
    <WrappedAddForm columns={columns} handleAddition={handleAddFormData} />
  )

  let tableProps = {
    size: "middle",
    rowSelection: rowSelection,
    components: components,
    bordered: true,
    dataSource: data,
    columns: cols,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: cancel,
      total: data.length,
      // size: "small",
    }
  }

  if (!(props.hasOwnProperty("addForm") && !props.addForm)) tableProps = { ...tableProps, footer }

  return (
    <EditableContext.Provider value={props.form}>
      <div style={{ paddingTop: 0 && !props.colData.length }} className="table-container">
        <div className="table-buttons">
          <Button disabled={props.loading} type="danger" onClick={handleMultiDelete} disabled={!selectedRows.length}>Remove</Button>
          <Button loading={props.loading} type="primary" onClick={() => props.handleSave(data, props.name)} disabled={selectedRows.length}>Save</Button>
        </div>
        <Table
          {...tableProps}
        />
      </div>
    </EditableContext.Provider>
  );
}

const GenericEditabelTable = Form.create()(EditableTable);

export default GenericEditabelTable