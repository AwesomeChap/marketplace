import React from 'react';
import { Button } from 'antd';

export default {
  foodProvider: [
    {
      title: "Id",
      dataIndex: "id",
      type: "text",
      editable: false,
    },
    {
      title: "Pending Request",
      dataIndex: "pendingRequest",
      type: "number",
      editable: false,
    },
    {
      title: "Status",
      dataIndex: "status",
      type: "select",
      options: ["Active", "Banned", "Pending"],
      editable: true,
    }
  ],
  order: [
    {
      title: "Seller Id",
      dataIndex: "sellerId",
      type: "text",
      editable: false
    },
    {
      title: "Customer Id",
      dataIndex: "customerId",
      type: "text",
      editable: false,
    },
    {
      title: "Price",
      dataIndex: "price",
      type: "number",
      editable: false,
    },
    {
      title: "Chairs Booked",
      dataIndex: "chairsBooked",
      type: "number",
      editable: false,
    },
    {
      title: "Complaint Id",
      dataIndex: "complaintId",
      type: "text",
      editable: true,
      render: (text) => <Button type="link">#{text}</Button>,
    }
  ],
  complain: [
    {
      title: "Customer Id",
      dataIndex: "customerId",
      type: "text",
      editable: false,
    },
    {
      title: "Topic",
      dataIndex: "topic",
      type: "text",
      editable: false,
    },
    {
      title: "Description",
      dataIndex: "description",
      type: "text",
      editable: false,
    },
    {
      title: "Status",
      dataIndex: "status",
      type: "select",
      options: ["Active", "Inactive"],
      editable: true
    }
  ],
  commission: [
    {
      title: "For",
      dataIndex: "for",
      type: "text",
      editable: false
    },
    {
      title: "Price",
      dataIndex: "price",
      type: "price",
      editable: true
    },
    {
      title: "Status",
      dataIndex: "status",
      type: "select",
      options: ["Active", "Inactive"],
      editable: true
    }
  ],
  subscribedPeople: [
    {
      title: "User Id",
      dataIndex: "userId",
      type: "text",
      clickable: true
    },
    {
      title: "Visibility",
      dataIndex: "visibility",
      type: "select",
      options: ["Local", "Town", "State", "County", "International"]
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      type: "text"
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      type: "text"
    },
    {
      title: "Status",
      dataIndex: "status",
      type: "select",
      options: ["Active", "End", "Terminated"]
    }
  ]
}