import React, { useState, useEffect } from "react";
import { List, Input, Icon, Row, Col, Button, Modal, Badge } from "antd";
import _ from "lodash";

const MoreFiltersListItem = props => {
  const [display, setDisplay] = useState(false);

  return (
    <List.Item
      onClick={e => props.handleSelect(props.item)}
      key={props.item}
      style={{ cursor: "pointer", color: props.selected && "#1890ff" }}
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

const MoreFiltersList = props => {
  return (
    <List
      dataSource={props.dataSource}
      grid={props.grid}
      bordered={props.bordered}
      size="small"
      header={
        props.header && (
          <Row type="flex" justify="space-between">
            <span style={{ fontSize: 20, fontWeight: 300, color: "#000" }}>More Filters</span>
            {!!props.selectedFilters.length && (<Col><Button style={{ padding: 0, height: 30 }} onClick={props.handleReset} type="link">Reset</Button></Col>)}
          </Row>
        )
      }
      renderItem={item => (
        <MoreFiltersListItem
          grid={!!props.grid}
          selected={props.selectedFilters.includes(item)}
          handleSelect={props.handleSelect}
          item={item}
        />
      )}
    />
  );
};

const MoreFiltersView = props => {

  const handleSelect = value => {
    if (props.moreFilters.includes(value)) {
      props.handleChange(props.moreFilters.filter(sf => sf !== value));
    } else {
      props.handleChange([...props.moreFilters, value]);
    }
  };

  const handleReset = () => { console.log("handle reset"); props.handleChange([]) };

  return (
    <MoreFiltersList
      header={true}
      dataSource={props.dataSource}
      handleSelect={handleSelect}
      selectedFilters={props.moreFilters}
      bordered={true}
      handleReset={handleReset}
    />
  );
};

export default MoreFiltersView;