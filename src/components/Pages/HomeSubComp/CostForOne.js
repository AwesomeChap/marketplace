import React, { useState, useEffect } from "react";
import { List, Input, Icon, Row, Col, Button, Modal, Badge } from "antd";
import _ from "lodash";

const CostForOneListItem = props => {
  const [display, setDisplay] = useState(false);

  return (
    <List.Item
      onClick={e => props.handleSelect(props.item)}
      key={props.item}
      style={{ cursor: "pointer" }}
      onMouseEnter={e => setDisplay(true)}
      onMouseLeave={e => setDisplay(false)}
      actions={
        !props.grid && [
          <span style={{ cursor: "pointer" }}>
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
      {props.item}
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
            {!!props.costRange && (<Col><Button onClick={props.handleReset} type="link">Reset</Button></Col>)}
          </Row>
        )
      }
      renderItem={item => (
        <CostForOneListItem
          grid={!!props.grid}
          selected={_.toLower(item) === _.toLower(props.costRange)}
          handleSelect={props.handleSelect}
          item={item}
        />
      )}
    />
  );
};

const CostForOneView = props => {

  const [costRange, setCostRange] = useState(null);

  const handleSelect = value => {
    if (costRange == value) {
      setCostRange(null);
    } else {
      setCostRange(value);
    }
  };

  const handleReset = () => setCostRange(null);

  return (
    <>
      <CostForOneList
        header={true}
        dataSource={["below £10", "£11 to £20", "£21 to £30", "£31 to £40", "£41 to £50", "more than £50"]}
        handleSelect={handleSelect}
        costRange={costRange}
        bordered={true}
        handleReset={handleReset}
      />
    </>
  );
};

export default CostForOneView;