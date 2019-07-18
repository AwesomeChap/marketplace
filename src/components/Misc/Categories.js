import React, { useState, useEffect } from 'react';
import { message, Tabs, Alert, Button } from 'antd';
import _ from 'lodash';
import QueueAnim from 'rc-queue-anim';
import GenericEditabelTable from '../Helper/GenericTable';
import CategoryConfigForm from '../Helper/CategoryConfigForm';
import CategoryApprovalTable from '../Helper/CategoryApprovals';
import Loader from '../Helper/Loader';
import { SimpleChoiceCard, CustomTitle } from '../Helper/ChoiceCards';
import '../../scss/choice-card.scss'
import axios from 'axios';

const { TabPane } = Tabs;

const Categories = (props) => {

  const [visibileCategoryId, setVisibileCategoryId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "#1";
    }
  }, [])

  useEffect(() => {
    setVisibileCategoryId(window.location.hash.split("#").join(''));
  }, [window.location.hash]);

  const handleSaveData = (data, name) => {
    const categoriesClone = { ...props.categories };
    categoriesClone[name]["values"] = data;
    const values = categoriesClone;

    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: "categories" }).then(({ data }) => {
      setLoading(false);

      props.updateCategoriesConfig(data.config);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  const handleSaveConfig = (colData, name) => {
    console.log('coldata from form', colData);
    const categoriesClone = { ...props.categories };
    colData = colData.map((cd) => {
      const obj = {};
      Object.keys(cd).map((key) => {
        if (key == "name") { obj["dataIndex"] = _.camelCase(cd["name"]); obj["title"] = cd[key] }
        else if (key == "editable") obj[key] = JSON.parse(cd[key]);
        else obj[key] = cd[key];
      })
      return obj;
    })
    // if(colData["editable"] != undefined) colData["editable"] = JSON.parse(colData["editable"]);
    categoriesClone[name]["colData"] = colData;
    const values = categoriesClone;
    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: "categories" }).then(({ data }) => {
      setLoading(false);

      props.updateCategoriesConfig(data.config);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })

  }

  const transformColData2DataSource = (dataSource) => {
    let transformedDataSource = dataSource.map((dataSrc) => {
      const obj = {};
      Object.keys(dataSrc).forEach((key) => {
        if (key === "editable") { obj[key] = JSON.stringify(JSON.parse(dataSrc[key])) }
        else if (key === "title") { obj["name"] = dataSrc[key] }
        else obj[key] = dataSrc[key];
      })
      return obj;
    })
    transformedDataSource = transformedDataSource.map((d, i) => ({ ...d, key: i + 1 }));
    return transformedDataSource;
  }

  const handleTabClick = (key) => setActiveTab(key);

  const handleChoice = (choice, name) => {
    if (choice == "custom") {
      setActiveTab("2");
    }
    else {
      const defaultConfig = [{
        title: "Name",
        dataIndex: "name",
        editable: true,
        type: "text"
      }]
      const dualConfig = [...defaultConfig, {
        title: "Description",
        dataIndex: "description",
        editable: true,
        type: "text"
      }]

      const colData = choice == "default" ? defaultConfig : dualConfig;
      const categoriesClone = { ...props.categories };
      categoriesClone[name]["colData"] = colData;
      const values = categoriesClone;

      setLoading(true)
      axios.post('/config', { values, userId: props.user._id, prop: "categories" }).then(({ data }) => {
        setLoading(false);

        props.updateCategoriesConfig(data.config);

        return message.success(data.message);
      }).catch((e) => {
        const error = JSON.parse(JSON.stringify(e.response.data));
        setLoading(false);
        return message.error(error.message);
      })
    }
  }

  const handleSaveApproval = (data, name) => {
    const categoriesClone = { ...props.categories };
    categoriesClone[name]["approval"] = data;
    const values = categoriesClone;

    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: "categories" }).then(({ data }) => {
      setLoading(false);

      props.updateCategoriesConfig(data.config);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  return (
    <>
      {
        props.categories.values.map((val, i) => {
          const name = _.camelCase(val)
          const colData = props.categories[name]["colData"];
          console.log('colData', colData);
          const dataSource = props.categories[name]["values"];
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
                    <Loader loading={loading}>
                      <Tabs activeKey={activeTab} onTabClick={handleTabClick} animated={true} type="card">
                        <TabPane tab="Manage" key="1">
                          {/* <CustomTitle title={'Manage '+val} /> */}
                          {!colData.length && !loading ? (
                            <>
                              <Alert message="This category needs some configuration please choose an appropraite option from below in order to proceed" type="info" closable />

                              <div className="space-evenly">
                                <SimpleChoiceCard
                                  heading="I need only name field"
                                  subHeading="I would like to move on with default config"
                                  handleClick={handleChoice}
                                  clickIndicator={"default"}
                                  name={name}
                                />

                                <SimpleChoiceCard
                                  heading="I need name & description"
                                  subHeading="I would like to move on with dual config"
                                  handleClick={handleChoice}
                                  clickIndicator={"dual"}
                                  name={name}
                                />

                                <SimpleChoiceCard
                                  heading="No, I need more fields"
                                  subHeading="I would like to create my own custom config"
                                  handleClick={handleChoice}
                                  clickIndicator={"custom"}
                                  name={name}
                                />

                              </div>
                            </>
                          ) : (
                              <GenericEditabelTable loading={loading} name={name} handleSave={handleSaveData} colData={props.categories[name]["colData"]} dataSource={props.categories[name]["values"]} />
                            )}
                        </TabPane>
                        <TabPane tab="Config" key="2">
                          {/* <CustomTitle title={val+' Config'} /> */}
                          <CategoryConfigForm loading={loading} name={name} handleSave={handleSaveConfig} dataSource={transformColData2DataSource(props.categories[name]["colData"])} />
                        </TabPane>
                        <TabPane tab="Approval" key="3">
                          {/* <CustomTitle title={val+' Approvals'} /> */}
                          <CategoryApprovalTable loading={loading} name={name} handleSave={handleSaveApproval} dataSource={props.categories[name]["approval"]} />
                        </TabPane>
                      </Tabs>
                    </Loader>
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

export default Categories;