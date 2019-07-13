import React, { useState, useEffect } from 'react';
import { Typography, Divider, Select, Input, Icon, Tooltip, Button, message, notification } from 'antd';
import axios from 'axios';
import GenericCrudField from '../../Helper/GenericCrudField';

const { Title } = Typography;
const { OptGroup, Option } = Select;

const CustomizationConfig = (props) => {

  const [categoriesConfig, setCategoriesConfig] = useState();
  const [fields, setFields] = useState([]);
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
    // console.log('updated config', categoriesConfig);
    if(categoriesConfig != undefined){
      traverseObject(categoriesConfig, 0, []);
      setFields(updatedFields);
    }
  }, [categoriesConfig]);

  const updateCfg = (updatedConfig, nh, i, values) => {
    if (nh.length - 1 > i) {
      updateCfg(updatedConfig[nh[i]], nh, i + 1, values);
    }
    else {
      // console.log('updateCfg', updatedConfig);
      console.log(`Before updateCfg[${nh[i]}]`,updatedConfig[nh[i]])
      updatedConfig[nh[i]] = values;
      console.log(`After updateCfg[${nh[i]}]`,updatedConfig[nh[i]])
    }
  } 

  const removeKey = (obj, targetKey) => {
    Object.keys(obj).forEach(key => {

      if (key === targetKey) delete obj[key];

      if (typeof obj[key] === 'object') {
        removeKey(obj[key])
      }
    })

    return obj;
  }

  const handleDeleteKey = (k) => {
    const updatedConfig = removeKey({ ...categoriesConfig }, k);
    setCategoriesConfig({ ...updatedConfig });
  }

  const handleChange = (values, name, nh) => {
    let updatedConfig = { ...categoriesConfig };

    console.log('values', values);

    updateCfg(updatedConfig, nh, 0, values);

    setCategoriesConfig({...updatedConfig});
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

  const updatedFields = [];

  const traverseObject = (obj, level, nameHistory) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          const newField = <GenericCrudField handleDeleteKey={handleDeleteKey} title={key} 
          level={level} values={obj[key]} name={key} handleChange={handleChange} 
          nameHistory={[...nameHistory, key]} obj={categoriesConfig} />

          setFields(updatedFields.push(newField));
        }
        else {
          traverseObject(obj[key], level + 1, key)
        }
      }
    })
  }

  return (
    <div>
      {/* {fields.map((field) => field)} */}
      <GenericCrudField obj={categoriesConfig} handleDeleteKey={handleDeleteKey} level={0} nameHistory={["origin"]} title={"Origin"} values={categoriesConfig.origin} name="origin" handleChange={handleChange} />
      {/* <GenericCrudField handleDeleteKey={handleDeleteKey} nameHistory={["foodTimeOfServe"]} title={"Time Based"} values={categoriesConfig.foodTimeOfServe} name="foodTimeOfServe" handleChange={handleChange} /> */}
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