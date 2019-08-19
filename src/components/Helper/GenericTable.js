import React, { useState, useEffect } from "react";
import "../../scss/table.scss";
import { Table, Input, InputNumber, Form, Button, message, Select, Switch, DatePicker, Tag, Upload, Icon } from "antd";
import CreateCategoryForm from "./CategoryConfigForm";
import Highlighter from 'react-highlight-words';
import moment from 'moment';

const { RangePicker } = DatePicker;
let typeIsSelect = false;

const AddForm = (props) => {

  const { form } = props;
  const { getFieldDecorator, validateFields, resetFields, getFieldValue } = form;
  const [uploadButtonDisplay, setUploadButtonDisplay] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return message.warning("fields should not be empty")
      }
      else {
        if (!!values["discount"] && values["discount"].length) values["discountTimeSpan"] = [values["discountTimeSpan"][0].format('DD-MM-YYYY'), values["discountTimeSpan"][1].format('DD-MM-YYYY')];
        if (values.hasOwnProperty("editable") && (values.editable == true || values.editable == false)) values.editable = JSON.stringify(values.editable);
        props.handleAddition(values);
        resetFields();
        setUploadButtonDisplay(true);
      }
    })
  }

  function beforeUpload(file, fileList) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  }

  const normFile = e => {
    if (e.fileList.length) setUploadButtonDisplay(false);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form layout={"inline"} onSubmit={handleSubmit}>
      <div className="flex-inline-form">
        <Button onClick={() => resetFields()} style={props.noAddFormLables && {marginRight: 10}} icon="undo" />
        {props.columns.map((col, i) => {
          const inputField = {
            text: <Input placeholder={col.title} />,
            number: <InputNumber placeholder={col.title} />,
            select: <Select placeholder={col.title}>{col.type == "select" ? col.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>) : undefined}</Select>,
            switch: <Switch />,
            tagSelect: <Select disabled={!typeIsSelect} placeholder={"Only for Select field"} dropdownStyle={{ display: "none" }} mode="tags" />,
            price: <InputNumber placeholder={col.title} formatter={value => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />,
            multiSelect: <Select mode="multiple" placeholder={col.title}>{col.type == "multiSelect" ? col.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>) : undefined}</Select>,
            date: <DatePicker placeholder="date" />,
            rangePicker : <RangePicker format="DD-MM-YYYY" />,
            upload: (<Upload listType="picture"
              action={"/upload"}
              onRemove={(file) => { setUploadButtonDisplay(true) }}
              name="file" beforeUpload={beforeUpload}>
              {uploadButtonDisplay && <Button><Icon type="upload" />Upload</Button>}
            </Upload>)
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

          if (col.type == "upload") {
            options = { ...options, valuePropName: 'fileList', getValueFromEvent: normFile, }
          }

          if (col.type == "tagSelect") options = {};

          if (col.type == "rangePicker") options = {rules: [{ type: 'array', required: true, message: 'Please select time!' }]}

          console.log(props.noAddFormLables);

          const labelProps = props.noAddFormLables ? {} : {label : col.title};

          return (
            <Form.Item key={`col-${col.type}-${col.dataIndex}`} className={col.type == "switch" && "switch-fix" || (col.type == "tagSelect" || col.type == "rangePicker") && "options-fix"} {...labelProps} >
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
  const [uploadButtonDisplay, setUploadButtonDisplay] = useState(false);

  function beforeUpload(file, fileList) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  }

  const normFile = e => {
    if (e.fileList.length) setUploadButtonDisplay(false);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const getInput = (type) => {
    if (props.inputType === "number") {
      return <InputNumber />;
    }

    if (props.inputType === "upload") {
      return (
        <Upload listType="picture"
          action={"/upload"}
          onRemove={(file) => { setUploadButtonDisplay(true) }}
          name="file" beforeUpload={beforeUpload}>
          {uploadButtonDisplay && <Button><Icon type="upload" />Upload</Button>}
        </Upload>
      )
    }

    else if (props.inputType === "multiSelect") {
      return <Select mode="multiple" style={{ width: "100%" }}>{props.options.map((opt, i) => <Option value={opt} key={i}>{opt}</Option>)}</Select>
    }

    else if(props.inputType === "rangePicker"){
      return <RangePicker format="DD-MM-YYYY"/>
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
    if (inputType == "upload") { options = { valuePropName: 'fileList', getValueFromEvent: normFile } }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              ...options, initialValue: inputType="rangePicker" ? record[dataIndex].map(val => moment(val)) : inputType === "switch" ? record[dataIndex] = JSON.parse(record[dataIndex]) : record[dataIndex],
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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [name, setName] = useState(props.name);
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    if (name != props.name) {
      setName(props.name);
      setEditingKey("");
      setSelectedRowKeys([]);
      setSearchText("");
      setData(props.dataSource)
    }
  }, [props.name, props.dataSource])

  const { loading } = props;
  const columns = [
    ...props.colData,
    {
      title: "Operation",
      dataIndex: "operation",
      width: "8%",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div className="table-operation-buttons">
            <EditableContext.Consumer>
              {form => (
                <Button type="primary" icon="save" onClick={() => save(form, record.key)}></Button>
              )}
            </EditableContext.Consumer>
            <Button type="danger" icon="close" ghost={true} onClick={() => cancel(record.key)} ></Button>
          </div>
        ) : (
            <div className="table-operation-buttons">
              <Button icon="edit" disabled={selectedRowKeys.length || editingKey !== '' || loading} onClick={() => edit(record.key)}></Button>
              <Button icon="delete" type="danger" onClick={() => handleDelete(record.key)} disabled={selectedRowKeys.length || loading} ></Button>
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

      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        row.editable = JSON.stringify(row.editable);

        if (row.editable == undefined) delete row.editable;
        newData.splice(index, 1, {
          ...item,
          ...row
        });

        setData(newData);
        setEditingKey("");
      } else {
        newData = [...newData, row];
        setData(newData);
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
    let keys = [...selectedRowKeys];
    let updatedData = [...data];
    updatedData = updatedData.filter((item) => !keys.includes(item.key));

    setData(updatedData);
    setSelectedRowKeys([]);
  }

  const handleAddFormData = (values) => {
    const newData = { key: data.length + 1, ...values };
    const updatedData = [...data, newData];
    setData(updatedData);
  }

  const components = {
    body: {
      cell: EditableCell
    }
  };

  let searchInput = React.useRef(null);
  let filterDropDown = React.useRef(null);

  const FilterDropDown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters, dataIndex }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={node => { searchInput = node; }}
        placeholder={`Search ${dataIndex}`}
        size="small"
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm)}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Button
        type="primary"
        onClick={() => handleSearch(selectedKeys, confirm)}
        icon="search"
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
        </Button>
      <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
        Reset
        </Button>
    </div>
  )

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: (props) => <FilterDropDown {...props} dataIndex={dataIndex} />,
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: (text) => {
      return (
        <Highlighter
          highlightStyle={{ backgroundColor: '#00eeff', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      )
    },
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const cols = columns.map(col => {
    if (!props.disableFilters) {
      if (!(col.dataIndex == "operation" || col.type == "upload" || col.type == "select")) {
        col = { ...col, ...getColumnSearchProps(col.dataIndex) }

        if (col.type == "number" || col.type == "price") {
          col["sorter"] = (a, b) => a[col.dataIndex] - b[col.dataIndex];
        }
      }

      if (col.type == "select") {
        col["filters"] = col.options.map(opt => ({ text: opt, value: opt }));
        col["filteredValue"] = filteredInfo[col.dataIndex] || null;
        col["onFilter"] = (value, record) => record[col.dataIndex] === value;
      }
    }

    col.key = col.dataIndex;

    if (col.type == "multiSelect") {
      col["render"] = options => {
        return <span>
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
      }
    }
    if (col.type == "upload") {
      col["render"] = (file) => {
        return <img className="thumbnail" src={file[0].thumbUrl || file[0].response.url} />
      };
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
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  };

  if (!props.colData.length) {
    return <CreateCategoryForm name={props.name} />
  }

  const footer = () => (
    <WrappedAddForm columns={columns} noAddFormLables={props.noAddFormLables} handleAddition={handleAddFormData} />
  )

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters); setSortedInfo(sorter);
  }

  const [tableIndex, setTableIndex] = useState("table");
  const [count, setCount] = useState(0);

  const clearAll = () => {
    setFilteredInfo({}); setSortedInfo({}); setSearchText("");
    setTableIndex(`table-${count}`);
    setCount(count + 1);
  };

  let tableProps = {
    key: props.name + "-" + tableIndex,
    size: "middle",
    rowSelection: rowSelection,
    components: components,
    bordered: true,
    dataSource: data,
    columns: cols,
    onChange: handleChange,
    // size: "small",
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: cancel,
      total: data.length,
    }
  }

  if (!(props.hasOwnProperty("addForm") && !props.addForm)) tableProps = { ...tableProps, footer }

  return (
    <EditableContext.Provider value={props.form}>
      <div style={{ paddingTop: 0 && !props.colData.length }} className="table-container">
        <div className="table-buttons">
          <Button disabled={props.loading} type="danger" onClick={handleMultiDelete} disabled={!selectedRowKeys.length}>Remove</Button>
          {props.handleSave && <Button loading={props.loading} type="primary" onClick={() => props.handleSave(data, props.name)} disabled={selectedRowKeys.length}>Save</Button>}
          {!props.disableFilters && <Button onClick={clearAll}>Clear Filters</Button>}
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