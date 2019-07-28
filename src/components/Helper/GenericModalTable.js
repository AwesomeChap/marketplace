import React, { useState, useEffect } from "react";
import "../../scss/table.scss";
import { Table, Input, InputNumber, Form, Button, message, Select, Switch, DatePicker, Tag, Upload, Icon } from "antd";
import Highlighter from 'react-highlight-words';

const EditableTable = (props) => {
  const [name, setName] = useState(props.name);
  const [searchText, setSearchText] = useState("");
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    if (name != props.name) {
      setName(props.name);
      setSearchText("");
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
        return (
          <div className="table-operation-buttons">
            <Button icon="edit" onClick={() => props.openEditModal(record.key)} />
            <Button icon="delete" type="danger" onClick={() => props.handleDeleteItem(record.key)} />
          </div>
        )
      }
    }
  ];

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
    filterDropdown: (props) => <FilterDropDown ref={node => filterDropDown = node} {...props} dataIndex={dataIndex} />,
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
        col["render"] = (opt) => {
          let color = 'geekblue';
          if (opt == "Veg") color = 'green';
          if (opt == "Non Veg") color = 'volcano';

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

    if (col.type == "upload") {
      col["render"] = (file) => {
        return <img className="thumbnail" src={file[0].thumbUrl || file[0].response.url} />
      };
    }
    return col
  });

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters); setSortedInfo(sorter);
  }

  const [tableIndex, setTableIndex] = useState("table");
  const [count, setCount] = useState(0);

  const clearAll = () => {
    setFilteredInfo({}); setSortedInfo({}); setSearchText("");
    setTableIndex(`table-${props.name}-${count}`);
    setCount(count + 1);
  };

  let tableProps = {
    key: props.name + "-" + tableIndex,
    size: "middle",
    bordered: true,
    dataSource: props.dataSource,
    columns: cols,
    onChange: handleChange,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      total: props.dataSource.length,
    }
  }

  return (
    <div style={{ paddingTop: 0 && !props.colData.length }} className="table-container">
      <div className="table-buttons">
        {!props.disableFilters && <Button onClick={clearAll}>Clear All</Button>}
      </div>
      <Table
        {...tableProps}
      />
    </div>
  );
}

const GenericModalTable = Form.create({ name: "generic-props-editable" })(EditableTable);

export default GenericModalTable