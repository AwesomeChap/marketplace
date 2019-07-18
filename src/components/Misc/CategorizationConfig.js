import React, { useState, useEffect } from 'react';
import { Typography, Divider, Select, Input, Icon, Tooltip, Button, message, notification, Tabs } from 'antd';
import axios from 'axios';
import GenericCrudField from '../Helper/GenericCrudField';
import _ from 'lodash';
import QueueAnim from 'rc-queue-anim';

const { TabPane } = Tabs;

const CustomizationConfig = (props) => {

  const [categoriesConfig, setCategoriesConfig] = useState();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibileCategoryId, setVisibileCategoryId] = useState(1);

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

    if(!window.location.hash){
      window.location.hash = "#1";
      // console.log(visibileCategoryId);
    }
  }, [])

  useEffect(() => {
    setVisibileCategoryId(window.location.hash.split("#").join(''));
  }, [window.location.hash]);

  useEffect(() => {
    console.log('updated config', categoriesConfig);
  }, [categoriesConfig, visibileCategoryId]);

  const updateCfg = (updatedConfig, nh, i, values) => {
    if (nh.length - 1 > i) {
      updateCfg(updatedConfig[nh[i]], nh, i + 1, values);
    }
    else {
      // console.log('updateCfg', updatedConfig);
      console.log(`Before updateCfg[${nh[i]}]`, updatedConfig[nh[i]])
      updatedConfig[nh[i]] = values;
      console.log(`After updateCfg[${nh[i]}]`, updatedConfig[nh[i]])
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

    setCategoriesConfig({ ...updatedConfig });
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

  return (
    <>
      {
        Object.keys(categoriesConfig).map((key, i) => {
          return (
            <QueueAnim
              delay={visibileCategoryId == i + 1 ? 300 : 0}    
              duration={400}
              ease={"easeOutCirc"}
              animConfig={[
                { opacity: [1, 0], translateY: [0, 50] },
                { opacity: [1, 0], translateY: [0, -50] }
              ]}
            >
              {
                visibileCategoryId == i + 1 ? [
                  <div key={`category-${i + 1}`} className="category-wrapper" id={i + 1}>
                    <Tabs type="card">
                      <TabPane tab="Manage" key="1"> 
                        <GenericCrudField handleDeleteKey={handleDeleteKey} title={_.startCase(key)}
                          level={0} values={categoriesConfig[key]} name={key} handleChange={handleChange}
                          nameHistory={[key]} obj={categoriesConfig} />
                      </TabPane>
                      <TabPane tab="Approval" key="2">
                        <GenericCrudField handleDeleteKey={handleDeleteKey} title={_.startCase(key)}
                          level={0} values={categoriesConfig[key]} name={key} handleChange={handleChange}
                          nameHistory={[key]} obj={categoriesConfig} />
                      </TabPane>
                    </Tabs>
                  </div>
                ] : [null]
              }
            </QueueAnim>
          )
        })
      }
    </>
  )
}

export default CustomizationConfig;