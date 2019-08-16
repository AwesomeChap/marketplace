export default {
  user: [
    {
      title: 'Option',
      dataIndex: 'option',
      type: "text",
      editable: false,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      type: "text",
      editable: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      type: "select",
      options: ["Approved", "Rejected", "Pending"],
      editable: false
    },
  ],
  admin: [
    {
      title: "User Id",
      dataIndex: "userId",
      type: "text",
      editable: false,
      clickable: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      type: "text",
      editable: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      type: "select",
      options: ["Approved","Rejected"],
      editable: true
    },
  ]
}