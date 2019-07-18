import React, { useState, useEffect } from 'react';
import { message, Tabs, Alert, Button } from 'antd';
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
  foodProvider: false,
  order: false,
  complain: false,
  commission: true,
  advertisement: false, //colData
  customer: false, //colData
  courier: true, //colData Approval 
}

const OtherFieldsTable = (props) => {

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [name, setName] = useState(props.name);

  useEffect(() => {
    console.log(props.name);
    setName(props.name);
  }, [props])

  // console.log(Coldata[props.name]);

  const handleSaveData = (data, name) => {
    const configClone = { ...props.config };
    configClone[name]["values"] = data;

    if (configClone[name].hasOwnProperty("editable")) delete configClone[name].editable

    const values = configClone[name];

    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: name }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, [name]: data.config };
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

    configClone[name]["colData"] = colData;
    const values = configClone[name];
    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: name }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, [name]: data.config };
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

      const colDataChoice = choice == "default" ? defaultConfig : dualConfig;
      const configClone = { ...props.config };
      configClone[name]["colData"] = colDataChoice;
      const values = configClone[name];

      console.log(values);

      setLoading(true)
      axios.post('/config', { values, userId: props.user._id, prop: name }).then(({ data }) => {
        setLoading(false);

        let updatedConfig = { ...props.config, [name]: data.config };
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
    configClone[name]["approval"] = data;
    const values = configClone;

    setLoading(true)
    axios.post('/config', { values, userId: props.user._id, prop: name }).then(({ data }) => {
      setLoading(false);

      let updatedConfig = { ...props.config, [name]: data.config };
      props.setConfig(updatedConfig);

      return message.success(data.message);
    }).catch((e) => {
      const error = JSON.parse(JSON.stringify(e.response.data));
      setLoading(false);
      return message.error(error.message);
    })
  }

  // console.log(props.config[props.name]["values"])

  return (
    <div className="category-wrapper" >
      <Loader loading={loading}>
        <Tabs activeKey={activeTab} onTabClick={handleTabClick} animated={true} type="card">
          <TabPane tab="Manage" key="1">
            {props.config[props.name].hasOwnProperty('colData') && !props.config[props.name]["colData"].length && !loading ? (
              <>
                <Alert message="This category needs some configuration please choose an appropraite option from below in order to proceed" type="info" closable />

                <div className="space-evenly">
                  <SimpleChoiceCard
                    heading="I need only name field"
                    subHeading="I would like to move on with default config"
                    handleClick={handleChoice}
                    clickIndicator={"default"}
                    name={props.name}
                  />

                  <SimpleChoiceCard
                    heading="I need name & description"
                    subHeading="I would like to move on with dual config"
                    handleClick={handleChoice}
                    clickIndicator={"dual"}
                    name={props.name}
                  />

                  <SimpleChoiceCard
                    heading="No, I need more fields"
                    subHeading="I would like to create my own custom config"
                    handleClick={handleChoice}
                    clickIndicator={"custom"}
                    name={props.name}
                  />

                </div>
              </>
            ) : (
                <GenericEditabelTable addForm={addForm.hasOwnProperty(props.name) ? addForm[props.name] : true} loading={loading} name={name} handleSave={handleSaveData} colData={props.config[props.name]["colData"] || Coldata[props.name]} dataSource={props.config[props.name]["values"]} />
              )}
          </TabPane>
          {props.config[props.name].hasOwnProperty('colData') && <TabPane tab="Config" key="2">
            <CategoryConfigForm loading={loading} name={props.name} handleSave={handleSaveConfig} dataSource={transformColData2DataSource(props.config[props.name]["colData"] || Coldata[props.name])} />
          </TabPane>}
          {props.config[props.name].hasOwnProperty('approval') && <TabPane tab="Approval" key="3">
            <CategoryApprovalTable loading={loading} name={props.name} handleSave={handleSaveApproval} dataSource={props.config[props.name]["approval"]} />
          </TabPane>}
        </Tabs>
      </Loader>
    </div>
  )
}

const mapStateToProp = state => state;

export default connect(mapStateToProp, { setConfig })(OtherFieldsTable);