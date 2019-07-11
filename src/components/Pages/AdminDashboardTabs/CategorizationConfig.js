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

  const updateCfg = (updatedConfig, nh, i, values) => {
    if(nh.length - 1 > i){
      updateCfg(updatedConfig[nh[i]], nh, i+1, values);
    } 
    else {
      updatedConfig[nh[i]] = values;
    }
  } 

  const handleChange = (values, prop, nh) => {
    let updatedConfig = { ...categoriesConfig };

    updateCfg(updatedConfig, nh, 0, values);

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

  const {foodTimeOfServe, specialOccassion,
    foodType, specialRequirements, spiceLevel, priceRange,
    healthInfo, mainIngredient } = categoriesConfig;

  return (
    <div>
      <GenericCrudField nameHistory={["origin"]} title={"Origin"} values={origin} name="origin" handleChange={handleChange} />
      <GenericCrudField nameHistory={["foodTimeOfServe"]} title={"Time Based"} values={foodTimeOfServe} name="foodTimeOfServe" handleChange={handleChange} />
      {/* <GenericCrudField obj={categoriesConfig} title={"Special Occassions"} values={specialOccassion} name="specialOccassion" handleChange={handleChange} />
      <GenericCrudField obj={categoriesConfig} title={"Food Type"} values={foodType} name="foodType" handleChange={handleChange} />
      <GenericCrudField obj={categoriesConfig} title={"Special Requirements"} values={specialRequirements} name="specialRequirements" handleChange={handleChange} />
      <GenericCrudField obj={categoriesConfig} title={"Spice Level"} values={spiceLevel} name="spiceLevel" handleChange={handleChange} />
      <GenericCrudField obj={categoriesConfig} title={"Health Info"} values={healthInfo} name="healthInfo" handleChange={handleChange} />
      <GenericCrudField obj={categoriesConfig} title={"Main Ingredients"} values={mainIngredient} name="mainIngredient" handleChange={handleChange} /> */}
    </div>

  )
}

export default CustomizationConfig;