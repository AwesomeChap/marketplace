import React, { useState, useEffect } from "react";
import { List, Input, Icon, Row, Col, Button, Modal, Badge } from "antd";
import _ from "lodash";

const CostForOneListItem = props => {
  const [display, setDisplay] = useState(false);

  return (
    <List.Item
      onClick={e => props.handleSelect(props.item.value)}
      key={props.item.label}
      style={{ cursor: "pointer", color: props.selected && "#1890ff" }}
      onMouseEnter={e => setDisplay(true)}
      onMouseLeave={e => setDisplay(false)}
      actions={ 
        !props.grid && [
          <span key={props.item.label} style={{ cursor: "pointer" }}>
            {props.selected ? (
              <Icon type="check" style={{ marginRight: 8, color: "#1890ff" }} />
            ) : (
                <React.Fragment>
                  {display && (
                    <Icon
                      type="check"
                      style={{ marginRight: 8, color: "#ccc" }}
                    />
                  )}
                </React.Fragment>
              )}
            {6}
          </span>
        ]
      }
    >
      {props.item.label}
    </List.Item>
  );
};

const CostForOneList = props => {
  return (
    <List
      dataSource={props.dataSource}
      grid={props.grid}
      bordered={props.bordered}
      size="small"
      header={
        props.header && (
          <Row type="flex" justify="space-between">
            <span style={{ fontSize: 20, fontWeight: 300, color: "#000" }}>Cost For One</span>
            {!!props.costRange && (<Col><Button style={{ padding: 0, height: 30 }} onClick={props.handleReset} type="link">Reset</Button></Col>)}
          </Row>
        )
      }
      renderItem={item => (
        <CostForOneListItem
          grid={!!props.grid}
          selected={_.toLower(JSON.stringify(item.value)) === _.toLower(JSON.stringify(props.costRange))}
          handleSelect={props.handleSelect}
          item={item}
        />
      )}
    />
  );
};

const CostForOneView = props => {

  const handleSelect = value => {
    if (props.costForOne == value) {
      props.handleChange(null);
    } else {
      props.handleChange(value);
    }
  };

  const handleReset = () => props.handleChange(null);

  return (
    <>
      <CostForOneList
        header={true}
        dataSource={[
          { value: { min: 0, max: 10 }, label: "£0 - £10" },
          { value: { min: 11, max: 20 }, label: "£11 - £20" },
          { value: { min: 21, max: 30 }, label: "£21 - £30" },
          { value: { min: 31, max: 40 }, label: "£31 - £40" },
          { value: { min: 41, max: 50 }, label: "£41 - £50" },
          { value: { min: 51, max: undefined }, label: "Above £50" },
        ]}
        handleSelect={handleSelect}
        costRange={props.costForOne}
        bordered={true}
        handleReset={handleReset}
      />
    </>
  );
};

export default CostForOneView;