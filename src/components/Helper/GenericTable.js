import React from "react";
import "../../scss/table.scss";
import { Table, Input, InputNumber, Popconfirm, Form, Button, message, Select, Switch, Row, Col } from "antd";
import Loader from "./Loader";
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
        if (values.editable) values.editable = JSON.stringify(values.editable);
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
            tagSelect: <Select disabled={!typeIsSelect} placeholder={"Only for Select field"} dropdownStyle={{ display: "none" }} mode="tags" />

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
  if (allValues.type != "select") {
    typeIsSelect = false;
    props.form.resetFields(["options"]);
  }
  else {
    typeIsSelect = true;
  }
}

const WrappedAddForm = Form.create({ name: "add-form", onValuesChange: handleValuesChange })(AddForm)

const EditableContext = React.createContext();

class EditableCell extends React.Component {

  getInput = (type) => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    else if (this.props.inputType === "switch") {
      return <Switch />
    }
    else if (this.props.inputType === "tagSelect") {
      return <Select disabled={type != "select"} style={{ width: "100%" }} dropdownStyle={{ display: "none" }} mode="tags" />
    }

    else if (this.props.inputType === "select") {
      return <Select style={{ width: "100%" }}>{this.props.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>)}</Select>
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;

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
            })(this.getInput(record["type"]))}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: props.dataSource, editingKey: "", selectedRowKeys: [], addformData: {} };
    console.log(this.state.data);
    const { loading } = this.props;
    this.columns = [
      ...this.props.colData,
      {
        title: "Operation",
        dataIndex: "operation",
        width: "20%",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <div className="table-operation-buttons">
              <EditableContext.Consumer>
                {form => (
                  <Button block type="primary" onClick={() => this.save(form, record.key)}>Save</Button>
                )}
              </EditableContext.Consumer>
              <Button block type="danger" ghost={true} onClick={() => this.cancel(record.key)} >Cancel</Button>
            </div>
          ) : (
              <div className="table-operation-buttons">
                <Button block disabled={this.state.selectedRowKeys.length || editingKey !== '' || loading} onClick={() => this.edit(record.key)}>Edit</Button>
                <Button block type="danger" onClick={() => this.handleDelete(record.key)} disabled={this.state.selectedRowKeys.length || loading} >Delete</Button>
              </div>
            );
        }
      }
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return message.warning("Input fields are empty")
      }
      const newData = [...this.state.data];

      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        row.editable = JSON.stringify(row.editable);
        console.log(row);
        newData.splice(index, 1, {
          ...item,
          ...row
        });

        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  handleDelete(key) {
    this.setState((prevState) => {
      let updatedData = [...prevState.data];
      updatedData = updatedData.filter((item) => item.key !== key);
      return {
        data: updatedData
      }
    })
  }

  handleMultiDelete = () => {
    let keys = [...this.state.selectedRowKeys];
    this.setState((prevState) => {
      let updatedData = [...prevState.data];
      updatedData = updatedData.filter((item) => !keys.includes(item.key));
      console.log(updatedData);
      return {
        data: updatedData,
        selectedRowKeys: []
      }
    })
  }

  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys }, () => console.log(this.state.selectedRowKeys));
  }

  handleAddformInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    this.setState((prevState) => {
      const stateCopy = { ...prevState };
      stateCopy.addformData[name] = value;
      return {
        stateCopy
      }
    })
  }

  handleAddFormData = (values) => {
    const { data } = this.state;
    const newData = { key: data.length + 1, ...values };
    this.setState((prevState) => {
      const updatedData = [...prevState.data, newData];
      return {
        data: updatedData
      }
    })
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.type,
          options: col.type === "select" ? col.options : [],
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };

    if (!this.props.colData.length) {
      return <CreateCategoryForm name={this.props.name} />
    }

    const footer = () => (
      <WrappedAddForm columns={this.columns} handleAddition={this.handleAddFormData} />
    )

    let tableProps = {
      size: "middle",
      rowSelection: rowSelection,
      components: components,
      bordered: true,
      dataSource: this.state.data,
      columns: columns,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: this.cancel,
        total: this.state.data.length,
        // size: "small",
      }
    }

    if (!(this.props.hasOwnProperty("addForm") && !this.props.addForm)) tableProps = { ...tableProps, footer }

    return (
      <EditableContext.Provider value={this.props.form}>
        <div style={{ paddingTop: 0 && !this.props.colData.length }} className="table-container">
          <div className="table-buttons">
            <Button disabled={this.props.loading} type="danger" onClick={this.handleMultiDelete} disabled={!this.state.selectedRowKeys.length}>Remove</Button>
            <Button loading={this.props.loading} type="primary" onClick={() => this.props.handleSave(this.state.data, this.props.name)} disabled={this.state.selectedRowKeys.length}>Save</Button>
          </div>
          <Table
            {...tableProps}
          />
        </div>
      </EditableContext.Provider>
    );
  }
}

const GenericEditabelTable = Form.create()(EditableTable);

export default GenericEditabelTable