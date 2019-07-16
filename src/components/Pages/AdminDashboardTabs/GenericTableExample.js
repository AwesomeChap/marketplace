import React from "react";
import { Table, Input, InputNumber, Popconfirm, Form, Button, message } from "antd";
import "../../../scss/table.scss";

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`
  });
}

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
        props.handleAddition(values);
        resetFields();
      }
    })
  }

  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <div className="inline-form">
        <Button icon="undo" />
        {props.columns.map((col, i) => {
          const inputField = {
            text: <Input placeholder={col.title} />,
            number: <InputNumber placeholder={col.title} />
          }
          if (col.dataIndex == "operation") {
            return <Button htmlType={"submit"} type="primary" icon="plus" />
          }
          return getFieldDecorator(col.dataIndex, {
            rules: [{ required: true, message: `${col.title} is required` }]
          })(inputField[col.type]);
        })}
      </div>
    </Form>
  )
}

const WrappedAddForm = Form.create({ name: "" })(AddForm)

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
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
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
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
    this.state = { data, editingKey: "", selectedRowKeys: [], addformData: {} };
    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "25%",
        editable: true,
        type: "text"
      },
      {
        title: "Age",
        dataIndex: "age",
        width: "15%",
        editable: true,
        type: "number"
      },
      {
        title: "Address",
        dataIndex: "address",
        width: "40%",
        editable: true,
        type: "text"
      },
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
                <Button block disabled={this.state.selectedRowKeys.length || editingKey !== ''} onClick={() => this.edit(record.key)}>Edit</Button>
                <Button block type="danger" onClick={() => this.handleDelete(record.key)} disabled={this.state.selectedRowKeys.length} >Delete</Button>
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

    return (
      <EditableContext.Provider value={this.props.form}>
        <div className="table-container">
          <div className="table-buttons">
            <Button type="danger" onClick={this.handleMultiDelete} disabled={!this.state.selectedRowKeys.length}>Remove</Button>
            <Button type="primary" disabled={this.state.selectedRowKeys.length}>Save</Button>
          </div>
          <Table  
            size={"middle"}
            rowSelection={rowSelection}
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: this.cancel,
              total: this.state.data.length,
              // size: "small",
            }}
            footer={() => (
              <WrappedAddForm columns={this.columns} handleAddition={this.handleAddFormData} />
            )}
          />
        </div>
      </EditableContext.Provider>
    );
  }
}

const GenericEditabelTableExample = Form.create()(EditableTable);

export default GenericEditabelTableExample