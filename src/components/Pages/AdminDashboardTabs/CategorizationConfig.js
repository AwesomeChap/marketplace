import React, { useState, useEffect } from 'react';
import { Typography, Divider, Select, Input, Icon, Tooltip, Button, message, notification } from 'antd';
import axios from 'axios';
import GenericCrudField from '../../Helper/GenericCrudField';

const { Title } = Typography;
const { OptGroup, Option } = Select;

const CustomizationConfig = (props) => {

  const [categoriesConfig, setCategoriesConfig] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/config?userId=${props.user._id}&prop=categories`).then(({ data }) => {
      setCategoriesConfig(data.config);
      if (data.type == "info") {
        return message.info(data.message);
      }
      return message.success(data.message)
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      return message.error(error.message);
    })
  }, [])

  useEffect(() => {
    console.log('updated config', categoriesConfig);
  }, [categoriesConfig]);

  const removeEmptyStrings = (obj) => {
    Object.keys(obj).forEach(key => {

      if (obj[key] === "") delete obj[key];

      if (typeof obj[key] === 'object') {
        removeEmptyStrings(obj[key])
      }
    })
  }

  const handleChange = (values, prop) => {
    let updatedConfig = { ...categoriesConfig };
    updatedConfig[prop] = values;
    setCategoriesConfig(updatedConfig);
  }

  const handleSubmit = (e) => {
    // if no errors
    // setLoading(true);
    // axios.post('/config', { values, userId: props.user._id, prop: "categories" }).then(({ data }) => {
    //   setLoading(false);
    //   return message.success(data.message);
    // }).catch((e) => {
    //   const error = JSON.parse(JSON.stringify(e.response.data));
    //   setLoading(false);
    //   return message.error(error.message);
    // })
  }

  if (!categoriesConfig) {
    return "loading..."
  }

  const newConfig = JSON.stringify(categoriesConfig) == "{}";

  const origin = ["India", "Britain", "Canada", "US", "Russia"];

  // const origin = {
    // India : ["North India", "South India"],
    // Britain: ["English","Irish"]
  // }

  const {foodTimeOfServe, specialOccassion,
    foodType, specialRequirements, spiceLevel, priceRange,
    healthInfo, mainIngredient } = categoriesConfig;

  return (
    <div>
      <GenericCrudField title={"Origin"} values={origin} name="origin" handleChange={handleChange} />
      <GenericCrudField title={"Time Based"} values={foodTimeOfServe} name="foodTimeOfServe" handleChange={handleChange} />
      <GenericCrudField title={"Special Occassions"} values={specialOccassion} name="specialOccassion" handleChange={handleChange} />
      <GenericCrudField title={"Food Type"} values={foodType} name="foodType" handleChange={handleChange} />
      <GenericCrudField title={"Special Requirements"} values={specialRequirements} name="specialRequirements" handleChange={handleChange} />
      <GenericCrudField title={"Spice Level"} values={spiceLevel} name="spiceLevel" handleChange={handleChange} />
      <GenericCrudField title={"Health Info"} values={healthInfo} name="healthInfo" handleChange={handleChange} />
      <GenericCrudField title={"Main Ingredients"} values={mainIngredient} name="mainIngredient" handleChange={handleChange} />
    </div>

  )
}

export default CustomizationConfig;