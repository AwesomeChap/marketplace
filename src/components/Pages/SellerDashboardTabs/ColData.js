export default {
  ingredients: [
    {
      title: "Name",
      dataIndex: "name",
      type: "text",
      editable: false,
    },
    {
      title: "Image",
      dataIndex: "upload",
      type: "upload",
      editable: false,
    },
    {
      title: "Type",
      dataIndex: "type",
      type: "select",
      options: ["Veg", "Non Veg"],
      editable: false,
    },
    {
      title: "Quantity (g)",
      dataIndex: "quantity",
      type: "number",
      editable: true
    }
  ],
  nutrition: [
    {
      title: "Name",
      dataIndex: "name",
      type: "text",
      editable: false,
    },
    {
      title: "Type",
      dataIndex: "type",
      type: "select",
      options: ["Vitamin", "Mineral", "Protien", "Sugar", "Fat"],
      editable: false,
    },
    {
      title: "Quantity/100g (%)",
      dataIndex: "quantity",
      type: "number",
      editable: true
    }
  ],
  foodItems: [
    {
      title: "Name",
      dataIndex: "name",
      type: "text",
      editable: false,
    },
    {
      title: "Image",
      dataIndex: "image",
      type: "upload",
      editable: false,
    },
    {
      title: "Type",
      dataIndex: "type",
      type: "select",
      options: ["Veg", "Non Veg"],
      editable: false,
    },
    {
      title: "Category",
      dataIndex: "category",
      type: "text",
      editable: false
    }
  ],
  branchSpecificDetails: [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      type: "select",
      options: [],
      editable: false,
      width: "24%",
    },
    {
      title: "Price (£)",
      dataIndex: "price", 
      type: "number",
      editable: true,
      width: "16%",
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      type: "number",
      editable: true,
      width: "20%",
    },
    {
      title: "Discount Time Span",
      dataIndex: "discountTimeSpan",
      type: "rangePicker",
      editable: true,
      width: "40%",
    }
  ]
}