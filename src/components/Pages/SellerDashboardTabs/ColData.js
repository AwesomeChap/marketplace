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
      title: "Price (£)",
      dataIndex: "price",
      type: "number",
      editable: false,
      // render: (text) => `£ ${text}`
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
      title: "category",
      dataIndex: "category",
      type: "text",
      editable: false
    }
  ],
}