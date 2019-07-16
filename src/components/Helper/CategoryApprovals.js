import React from "react";
import "../../scss/table.scss";
import { Table, Input, InputNumber, Popconfirm, Form, Button, message, Tag, Alert, Divider } from "antd";
import Loader from "./Loader";
import GenericEditabelTable from "./GenericTable";


const CategoryApprovalTable = (props) => {
  const colData = [
    {
      title: "Name",
      dataIndex: "name",
      type: "text",
      // editable: true,
      width: "15%"
    },
    {
      title: "Provider Id",
      dataIndex: "providerId",
      type: "text",
      // editable: true,
      width: "20%",
      options: ["text", "number", "switch", "select"]
    },
    {
      title: "Description",
      dataIndex: "description",
      type: "text",
      // editable: true,
      width: "30%"
    },
    {
      title: "Status",
      dataIndex: "status",
      type: "select",
      editable: true,
      width: "15%",
      options: ["Approved","Pending","Deneid"]
    },
  ]

  const handleSave = (data) => {
    props.handleSave(data, props.name);
  }

  const dataSource = props.dataSource ? props.dataSource : [];
  console.log(dataSource);

  return (
    <>
      <GenericEditabelTable loading={props.loading} addForm={false} colData={colData} handleSave={handleSave} dataSource={dataSource} />
    </>
  )
}

export default CategoryApprovalTable;