import React from "react";
import "../../scss/table.scss";
import { Table, Input, InputNumber, Popconfirm, Form, Button, message, Tag, Alert, Divider } from "antd";
import Loader from "./Loader";
import GenericEditabelTable from "./GenericTable";


const CategoryConfigForm = (props) => {
  const colData = [
    {
      title: "Name",
      dataIndex: "name",
      type: "text",
      editable: true,
      width: "25%"
    },
    {
      title: "Type",
      dataIndex: "type",
      type: "select",
      // editable: true,
      width: "25%",
      options: ["text", "number", "price", "select", "multiSelect", "upload"]
    },
    {
      title: "Editable",
      dataIndex: "editable",
      type: "switch",
      editable: true,
      width: "10%"
    },
    {
      title: "Options",
      dataIndex: "options",
      type: "tagSelect",
      editable: true,
      width: "30%",
      render: tags => (
        <span>
          {tags && tags.map((tag, i) => {
            let color = i % 3 == 1 ? 'geekblue' : 'green';
            if (i % 3 == 0) {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
  ]

  const handleSave = (data) => {
    props.handleSave(data, props.name);
  }

  const dataSource = props.dataSource ? props.dataSource : [];
  console.log(dataSource);

  const addFormParamater = props.hasOwnProperty("addForm") ? addForm : true;

  return (
    <>
      <GenericEditabelTable disableFilters={true} addForm={addFormParamater} loading={props.loading} colData={colData} handleSave={handleSave} dataSource={dataSource} />
    </>
  )
}

export default CategoryConfigForm;