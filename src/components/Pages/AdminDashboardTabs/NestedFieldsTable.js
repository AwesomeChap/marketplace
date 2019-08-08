import React, { useState, useEffect } from 'react';
import { message, Tabs, Alert, Button, Tag, Modal, Form, Row, Col } from 'antd';
import _ from 'lodash';
import GenericEditabelTable from '../../Helper/GenericTable';
import GenericClickableTable from '../../Helper/GenericClickableTable';
import CategoryConfigForm from '../../Helper/CategoryConfigForm';
import CategoryApprovalTable from '../../Helper/CategoryApprovals';
import Loader from '../../Helper/Loader';
import { SimpleChoiceCard, CustomTitle } from '../../Helper/ChoiceCards';
import '../../../scss/choice-card.scss'
import axios from 'axios';
import { connect } from 'react-redux';
import { setConfig } from '../../../redux/actions/actions';
import ColData from './ColData';

const { TabPane } = Tabs;
const { confirm } = Modal;

const addForm = {
  advertisement: {
    addPricing: true,
    subscribedSellers: false
  },
  courier: {
    courierClasses: true,
    registeredCouriers: true,
  }
}

const SubscribedPeople = (props) => {

  const [loading, setLoading] = useState(false);
  const [advts, setAdvts] = useState([]);
  const [currentAdvtData, setCurrentAdvtData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    setLoading(true);
    axios.get(`/advertisement?userId=${props.user._id}`).then(({ data }) => {
      let advtsData = data.advts;
      advtsData.forEach(aD => {
        aD["userId"] = aD._userId;
        aD["status"] = _.startCase(aD["status"]);
        delete aD["_userId"];
      })
      console.log(advtsData);
      setAdvts(advtsData);
      setLoading(false);
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) });
  }, [])

  const showAdvtData = (data) => {
    return <div className="advtPhotos">
      {data.newPhotos.length ? data.newPhotos.map((photo, i) => (
        <img src={photo.thumbUrl} key={`photo-${i + 1}`} />
      )) : data.photos.map((photo, i) => (
        <img src={photo.thumbUrl} key={`photo-${i + 1}`} />
      ))}
    </div>
  }

  const showUserData = (data) => {
    return <div>User Data</div>
  }

  const handleCancel = () => {
    setVisible(false);
    if (!!currentAdvtData) {
      setCurrentAdvtData(null);
    }
    if (!!userData) {
      setUserData(null);
    }
  }

  const openViewModal = (key) => {
    console.log(key);
    const currentItem = advts.find(el => el.key === key);
    setCurrentAdvtData(currentItem);
    console.log(currentItem);
    setVisible(true);
  }

  const openViewUserModal = (userId) => {
    //make api call and fetch userData
    setCurrentUserData("User Data");
    //and set it to user data
    setVisible(true);
  }

  const handleDeleteItem = (key) => {
    const advtId = advts.find(el => el.key === key)._id;
    setLoading(true);
    axios.delete('/advertisement', { data: { advtId } }).then(({ data }) => {
      setLoading(false);
      setAdvts(advts.filter((ad, i) => ad._id !== advtId));
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) });
  }

  const handleApproveItem = () => {
    setLoading(true);
    axios.put('/advertisement', { advtId: currentAdvtData._id, values: {...currentAdvtData, status: "active" } }).then(({ data }) => {
      setLoading(false);
      advts.find(el => el.key === currentAdvtData.key).status = "Active";
      setCurrentAdvtData(null);
      setVisible(false);
      return message.success(data.message);
    }).catch(e => { setLoading(false); return message.error(e.message) });
  }

  function showPropsConfirm(key) {
    confirm({
      title: 'Are you sure ?',
      content: <span>This action would result in permanent deletion of this advertisement</span>,
      okText: "Yes I'm",
      okType: 'danger',
      cancelText: "Abort",
      centered: true,
      onOk() {
        handleDeleteItem(key);
      }
    });
  }

  return (
    <Loader loading={loading}>
      <div className="menu-item-page">
        <Modal title={!!currentAdvtData ? "Advertisement Data" : "User Data"} width={600} visible={visible} footer={null}
          onCancel={handleCancel} centered={true} destroyOnClose={true}>
          {!!currentAdvtData ? showAdvtData(currentAdvtData) : showUserData(currentUserData)}
          <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}>
            <Row type="flex" justify="center">
              <Col>
                {!!currentAdvtData && currentAdvtData.status === "Pending" && <Button onClick={handleApproveItem} className="center-me" shape={"round"} size="large" loading={loading} htmlType={"submit"} type="primary" icon="check">Approve</Button>}
              </Col>
            </Row>
          </Form.Item>
        </Modal>
        <GenericClickableTable openViewUserModal={openViewUserModal} handleDeleteItem={showPropsConfirm} openViewModal={openViewModal} colData={ColData["subscribedPeople"]} dataSource={advts} name={"advts-view"} />
      </div>
    </Loader>
  )
}

const OtherFieldsTable = (props) => {

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(`firstTab`);
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
          <TabPane tab={"Subscribed People"} key={"firstTab"}>
            <SubscribedPeople user={props.user} />
          </TabPane>
          {props.config[props.rootName].values.map((val, i) => {
            const subName = _.camelCase(val);
            let obj = props.config[props.rootName][subName];
            if (subName == "subscribedSellers") {
              obj.values = advts;
            }
            // else obj = props.config[props.rootName][subName];
            console.log(val, obj);
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
                  <TabPane tab={"Approval " + val} key={`${val}-${(i + 1) * 3}`}>
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