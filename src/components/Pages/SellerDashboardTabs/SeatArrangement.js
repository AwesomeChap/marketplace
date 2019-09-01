import React, { useState, useEffect } from 'react';
import { Input, Button, Icon } from 'antd';
import '../../../scss/layout.scss'
import StandardTable from '../../Helper/StandardTable';
import RoundTable from '../../Helper/RoundTable';
import Wall from '../../Helper/Wall';
import _ from 'lodash'
import Loader from '../../Helper/Loader';

const SeatArrangement = (props) => {

  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [layoutComponents, setLayoutComponents] = useState([]);

  useEffect(() => {
    const branchIndex = props.sellerConfig.branches.map(obj => obj._id).indexOf(props.branchId);
    if(props.sellerConfig.branches[branchIndex].hasOwnProperty("seatArrangement")){
      setLayoutComponents(props.sellerConfig.branches[branchIndex].seatArrangement.layout);
    } 
    else{
      setLayoutComponents([])
    }
  },[props.branchId])

  if(!props.branchId){
    return <div>No Branches Found!</div>
  }

  const handleAddComponent = (type) => setLayoutComponents([...layoutComponents, { type, key: `${type[0]}_${new Date().valueOf()}`, name: `${_.upperCase(type[0])}-${Math.random().toString(9).substr(2, 5)}` }]);

  const handleChange = (key, values) => {
    let layoutComponentsClone = [...layoutComponents];
    layoutComponentsClone = layoutComponentsClone.map((lc) => {
      if (lc.key == key) {
        const obj = { ...lc };
        Object.keys(values).forEach((k) => {
          obj[k] = values[k];
        });
        return obj;
      }
      return lc;
    })

    setLayoutComponents(layoutComponentsClone);
  }

  const handleDelete = (key) => {
    const updatedList = layoutComponents.filter((lc) => lc.key !== key);
    setLayoutComponents(updatedList);
  }

  const CloseButton = ({ compkey }) => (
    <div onClick={() => handleDelete(compkey)} className="top-right-close" ><Icon type="close" /></div>
  )

  const handleSave = () => {
    const values = {
      dimensions: {
        width, height
      },
      layout: layoutComponents
    }
    props.handleSaveConfig(values, "seatArrangement", props.branchId, props.done);
  }

  return (
    <Loader loading={props.loading}>
      {
        props.diningPossible() ? (
          <>
            <div className="seat-arrangement-controls">
        <Input placeholder={"eg. 500"} value={height} onChange={({ target: { value } }) => setHeight(value)} addonBefore="Height" />
        <Input placeholder={"eg. 500"} value={width} onChange={({ target: { value } }) => setWidth(value)} addonBefore="Width" />
        <Button icon="border-horizontal" onClick={() => handleAddComponent("vertical")}>Add Vertical Table</Button>
        <Button icon="border-verticle" onClick={() => handleAddComponent("horizontal")}>Add Horizontal Table</Button>
        <Button icon="plus-circle" onClick={() => handleAddComponent("round")}>Add Round Table</Button>
        <Button icon="border" onClick={() => handleAddComponent("wall")}>Add Wall</Button>
        <Button type="primary" icon="save" loading={props.loading} onClick={handleSave}>Save</Button>
      </div>
      <div className="layout-container">
        <div style={{ width: width + "px", height: height + "px" }} className="layout">
          <div className="entrance">Entrance</div>
          {layoutComponents.map((lc) => {

            const props = { handleChange, lc, key: lc.key };

            const layoutComponent = {
              vertical: <StandardTable mode="vertical" {...props} ><CloseButton compkey={lc.key} /></StandardTable>,
              horizontal: <StandardTable {...props} ><CloseButton compkey={lc.key} /></StandardTable>,
              round: <RoundTable {...props} ><CloseButton compkey={lc.key} /></RoundTable>,
              wall: <Wall {...props} ><CloseButton compkey={lc.key} /></Wall>,
            };

            return layoutComponent[lc.type];
          })}
        </div>
      </div>
          </>
        ) : (
          <div>This service is not accessible to you, In order to activate it add <b>Dining In</b> to available services of your branch</div>
        )
      }
    </Loader>
  )
}

export default SeatArrangement;