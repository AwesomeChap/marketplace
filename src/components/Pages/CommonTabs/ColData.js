export default [
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
    editable: true
  },
]