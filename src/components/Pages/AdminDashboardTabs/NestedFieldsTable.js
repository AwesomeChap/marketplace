import React, { useState, useEffect } from 'react';
import { message, Tabs, Alert, Button, Tag } from 'antd';
import _ from 'lodash';
import GenericEditabelTable from '../../Helper/GenericTable';
import CategoryConfigForm from '../../Helper/CategoryConfigForm';
import CategoryApprovalTable from '../../Helper/CategoryApprovals';
import Loader from '../../Helper/Loader';
import { SimpleChoiceCard, CustomTitle } from '../../Helper/ChoiceCards';
import '../../../scss/choice-card.scss'
import axios from 'axios';
import Coldata from './ColData';
import { connect } from 'react-redux';
import { setConfig } from '../../../redux/actions/actions';

const { TabPane } = Tabs;

const addForm = {
  advertisement: {
    addPricing : true,
    subscribedSellers: false
  }
}

const OtherFieldsTable = (props) => {

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(`${_.camelCase(props.config[props.rootName]["values"][0])}-values`);
  const [rootName, setRootName] = useState(props.rootName);

  useEffect(() => {
    setRootName(props.rootName);
  }, [props])

  const handleSaveData = (data, name) => {
    const configClone = { ...props.config };
    configClone[props.rootName][name]["values"] = data;

    if (configClone[props.rootName][name].hasOwnProperty("editable")) delete configClone[props.rootName][name].editable

    const values = configClone[props.rootName];

    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: props.rootName }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, [props.rootName]: data.config };
      props.setConfig(updatedConfig);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  const handleSaveConfig = (colData, name) => {
    console.log('coldata from form', colData);
    
    const configClone = { ...props.config };
    colData = colData.map((cd) => {
      const obj = {};
      Object.keys(cd).map((key) => {
        if (key == "name") { obj["dataIndex"] = _.camelCase(cd["name"]); obj["title"] = cd[key] }
        else if (key == "editable") obj[key] = JSON.parse(cd[key]);
        else obj[key] = cd[key];
      })
      return obj;
    })

    configClone[props.rootName][name]["colData"] = colData;
    const values = configClone[props.rootName];
    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: props.rootName }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, [props.rootName]: data.config };
      props.setConfig(updatedConfig);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  const transformColData2DataSource = (colData) => {
    let transformedColData = colData.map((cd) => {
      const obj = {};
      Object.keys(cd).forEach((key) => {
        if (key === "editable") { obj[key] = JSON.stringify(JSON.parse(cd[key])) }
        else if (key === "title") { obj["name"] = cd[key] }
        else obj[key] = cd[key];
      })
      return obj;
    })
    transformedColData = transformedColData.map((d, i) => ({ ...d, key: i + 1 }));
    return transformedColData;
  }

  const handleTabClick = (key) => setActiveTab(key);

  const handleChoice = (choice, name) => {
    if (choice == "custom") {
      console.log(name);
      setActiveTab(`${name}-colData`);
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

      const colDataChoice = choice == "default" ? defaultConfig : dualConfig;
      const configClone = { ...props.config };
      configClone[props.rootName][name]["colData"] = colDataChoice;
      const values = configClone[props.rootName];

      setLoading(true)
      axios.post('/config', { values, userId: props.user._id, prop: props.rootName }).then(({ data }) => {
        setLoading(false);

        let updatedConfig = { ...props.config, [props.rootName]: data.config };
        props.setConfig(updatedConfig);

        return message.success(data.message);
      }).catch((e) => {
        const error = JSON.parse(JSON.stringify(e.response.data));
        setLoading(false);
        return message.error(error.message);
      })
    }
  }

  const handleSaveApproval = (data, name) => {
    const configClone = { ...props.config };
    configClone[props.rootName][name]["approval"] = data;
    const values = configClone[props.rootName];

    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: props.rootName }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, [props.rootName]: data.config };
      props.setConfig(updatedConfig);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  return (
    <div className="category-wrapper" >
      <Loader loading={loading}>
        <Tabs activeKey={activeTab} onTabClick={handleTabClick} animated={true} type="card">
          {props.config[props.rootName].values.map((val, i) => {
            const subName = _.camelCase(val);
            console.log(val, props.config[props.rootName][subName]);
            const obj = props.config[props.rootName][subName];
            return Object.keys(obj).map((key) => {
              if (key === "values") {
                return (
                  <TabPane tab={"Manage " + val} key={`${subName}-${key}`}>
                    {props.config[props.rootName][subName].hasOwnProperty('colData') && !props.config[props.rootName][subName]["colData"].length && !loading ? (
                      <>
                        <Alert message="This category needs some configuration please choose an appropraite option from below in order to proceed" type="info" closable />

                        <div className="space-evenly">
                          <SimpleChoiceCard
                            heading="I need only name field"
                            subHeading="I would like to move on with default config"
                            handleClick={handleChoice}
                            clickIndicator={"default"}
                            name={subName}
                          />

                          <SimpleChoiceCard
                            heading="I need name & description"
                            subHeading="I would like to move on with dual config"
                            handleClick={handleChoice}
                            clickIndicator={"dual"}
                            name={subName}
                          />

                          <SimpleChoiceCard
                            heading="No, I need more fields"
                            subHeading="I would like to create my own custom config"
                            handleClick={handleChoice}
                            clickIndicator={"custom"}
                            name={subName}
                          />

                        </div>
                      </>
                    ) : (
                        <GenericEditabelTable
                          addForm={addForm[props.rootName].hasOwnProperty(subName) ? addForm[props.rootName][subName] : true} 
                          loading={loading} name={subName} handleSave={handleSaveData}
                          colData={props.config[props.rootName][subName]["colData"] || Coldata[props.rootName][subName]}
                          dataSource={props.config[props.rootName][subName]["values"]} />
                      )}
                  </TabPane>
                )
              }
              else if (key == "colData" && props.config[props.rootName][subName].hasOwnProperty('colData')) {
                return (
                  <TabPane tab={"Config " + val} key={`${subName}-${key}`}>
                    <CategoryConfigForm loading={loading} name={subName} handleSave={handleSaveConfig} dataSource={transformColData2DataSource(props.config[props.rootName][subName]["colData"] || Coldata[props.rootName][subName])} />
                  </TabPane>
                )
              }
              else if (props.config[props.rootName][subName].hasOwnProperty('approval') && key == "approval") {
                return (
                  <TabPane tab="Approval" key={`${val}-${(i + 1) * 3}`}>
                    <CategoryApprovalTable loading={loading} name={subName} handleSave={handleSaveApproval} dataSource={props.config[props.rootName][subName]["approval"]} />
                  </TabPane>
                )
              }
            })
          })}
        </Tabs>
      </Loader>
    </div>
  )
}

const mapStateToProp = state => state;

export default connect(mapStateToProp, { setConfig })(OtherFieldsTable);