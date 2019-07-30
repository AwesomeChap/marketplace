import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import '../../../scss/layout.scss'
import StandardTable from '../../Helper/StandardTable';
import RoundTable from '../../Helper/RoundTable';
import Wall from '../../Helper/Wall';

const SeatArrangement = (props) => {

  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const [layoutComponents, setLayoutComponents] = useState([]);

  useEffect(()=>{
    console.log(layoutComponents);
  },[layoutComponents])

  const handleAddComponent = (type) => setLayoutComponents([...layoutComponents, { type, key: `${type}-comp-${layoutComponents.length}` }]);

  const handleChange = (key, values) => {
    let layoutComponentsClone = { ...layoutComponents };
    layoutComponentsClone = layoutComponentsClone.map((lc) => {
      if (lc.key == key) {
        const obj = {...lc.key};
        Object.keys(values).forEach((k) => {
          obj[k] = values[k];
        });
        return obj;
      }
      return lc;
    })

    setLayoutComponents(layoutComponentsClone);
  }

  return (
    <div>
      <div className="seat-arrangement-controls">
        <Input placeholder={"eg. 500"} value={height} onChange={({ target: { value } }) => setHeight(value)} addonBefore="Height" />
        <Input placeholder={"eg. 500"} value={width} onChange={({ target: { value } }) => setWidth(value)} addonBefore="Width" />
        <Button icon="border-horizontal" onClick={() => handleAddComponent("vertical")}>Add Vertical Table</Button>
        <Button icon="border-verticle" onClick={() => handleAddComponent("horizontal")}>Add Horizontal Table</Button>
        <Button icon="plus-circle" onClick={() => handleAddComponent("round")}>Add Round Table</Button>
        <Button icon="border" onClick={() => handleAddComponent("wall")}>Add Wall</Button>
        <Button type="primary" icon="save">Save</Button>
      </div>
      <div className="layout-container">
        <div style={{ width: width + "px", height: height + "px" }} className="layout">
          <div className="entrance">Entrance</div>
          {layoutComponents.map((lc) => {

            const props = { handleChange, ...lc };

            const layoutComponent = {
              vertical: <StandardTable mode="vertical" {...props} />,
              horizontal: <StandardTable {...props} />,
              round: <RoundTable {...props} />,
              wall: <Wall {...props} />,
            };
            return layoutComponent[lc.type];
          })}
        </div>
      </div>
    </div>
  )
}

export default SeatArrangement;