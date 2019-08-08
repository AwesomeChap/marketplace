import React, { useState, useEffect } from "react";
import "../../scss/table.scss";
import { Table, Input, InputNumber, Form, Button, message, Select, Switch, DatePicker, Tag, Icon, Tooltip } from "antd";
import CreateCategoryForm from "./CategoryConfigForm";
import Highlighter from 'react-highlight-words';
import _ from 'lodash';
import moment from 'moment';

const ClickableContext = React.createContext();

const ClickableCell = (props) => {
  const [editing, setEditing] = useState(false);

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

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const renderCell = ({ getFieldDecorator, getFieldValue }) => {
    const {
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      clickable,
      openViewUserModal,
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
        {clickable ? <Button onClick={openViewUserModal}>{children}</Button> : <div>{children} </div>}
      </td>
    );
  };

  return (
    <ClickableContext.Consumer>{renderCell}</ClickableContext.Consumer>
  );
}

const ClickableTable = (props) => {
  const [name, setName] = useState(props.name);
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    if (name != props.name) {
      setName(props.name);
      setSelectedRowKeys([]);
      setSearchText("");
    }
    console.log(props.dataSource);
  }, [props.name, props.dataSource])

  const { loading } = props;
  const columns = [
    ...props.colData,
    {
      title: "Operation",
      dataIndex: "operation",
      width: "8%",
      render: (text, record) => {
        return (
          <div className="table-operation-buttons">
            <Tooltip title="View Advertisement"><Button icon="eye" onClick={() => props.openViewModal(record.key)} /></Tooltip>
            <Tooltip title="Remove Advertisement"><Button icon="delete" type="danger" onClick={() => props.handleDeleteItem(record.key)} /></Tooltip>
          </div>
        )
      }
    }
  ];

  const components = {
    body: {
      cell: ClickableCell
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

      if (dataIndex == "price") {
        text = `£ ${text}`;
      }
      if (Array.isArray(text)) {
        text = text.join(', ');
      }
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
      if (!(col.dataIndex == "operation" || col.type == "select")) {
        col = { ...col, ...getColumnSearchProps(col.dataIndex) }

        if (col.type == "number" || col.type == "price") {
          col["sorter"] = (a, b) => a[col.dataIndex] - b[col.dataIndex];
        }
      }

      // if(col.dataIndex === "date") {
      //   col["sorter"] = (a,b) => { console.log(moment(a).diff(moment(b))); return moment(a).diff(moment(b));}
      // }

      if (col.type == "select") {
        col["filters"] = col.options.map(opt => ({ text: opt, value: opt }));
        col["filteredValue"] = filteredInfo[col.dataIndex] || null;
        col["onFilter"] = (value, record) => record[col.dataIndex] === value;
        col["render"] = (opt) => {
          let color = 'geekblue';
          if (opt == "Active") color = 'green';
          else if (opt == "Terminated") color = 'red';
          else if (opt == "End") color = 'geekblue';

          return (
            <Tag color={color} key={opt}>
              {opt && opt.toUpperCase()}
            </Tag>
          );
        }
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
    if (col.clickable) {
      return {
        ...col,
        onCell: record => ({
          record, clickable: col.clickable, openViewUserModal: props.openViewUserModal
        })
      }
    }
    else {
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.type,
          options: (col.type === "select" || col.type === "multiSelect") ? col.options : [],
          dataIndex: col.dataIndex,
          title: col.title,
        })
      };
    }
  });

  if (!props.colData.length) {
    return <CreateCategoryForm name={props.name} />
  }

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
    components: components,
    bordered: true,
    dataSource: props.dataSource,
    columns: cols,
    onChange: handleChange,
    // size: "small",
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      total: props.dataSource.length,
    }
  }

  return (
    <ClickableContext.Provider value={props.form}>
      <div style={{ paddingTop: 0 && !props.colData.length, width: 100 + '%' }} className="table-container">
        <div className="table-buttons">
          {!props.disableFilters && <Button onClick={clearAll}>Clear All</Button>}
        </div>
        <Table
          {...tableProps}
        />
      </div>
    </ClickableContext.Provider>
  );
}

const GenericApprovalTable = Form.create({ name: "generic-props-clickable" })(ClickableTable);

export default GenericApprovalTable