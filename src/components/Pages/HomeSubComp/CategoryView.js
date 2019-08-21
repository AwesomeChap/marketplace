import React, { useState, useEffect } from "react";
import { List, Input, Icon, Row, Col, Button, Modal, Badge } from "antd";
import _ from "lodash";

const CategoryListItem = props => {
  const [display, setDisplay] = useState(false);

  const listItem = (
    <div style={{ padding: "6px 12px", border: "1px solid #ddd" }}>
      <Row type="flex" justify="space-between">
        <Col>
          <span>{props.item}</span>
        </Col>
        <Col>
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
        </Col>
      </Row>
    </div>
  );

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
      {props.grid ? listItem : props.item}
    </List.Item>
  );
};

const CategoryList = props => {
  return (
    <List
      dataSource={props.dataSource}
      grid={props.grid}
      bordered={props.bordered}
      size="small"
      header={
        props.header && (
          <Row type="flex" justify="space-between">
            {/* <Col> */}
              <span style={{fontSize: 20, fontWeight: 300, color: "#000"}}>Categories</span>
            {/* </Col> */}
            <Col>
              <Button
                style={{ marginRight: -8 }}
                type="link"
                // icon="right-circle"
                onClick={props.handleViewAll}
              >
                View All
              </Button>
            </Col>
            <Col>
              <Badge style={{ cursor: "pointer" }} count={props.selectedCategories.length}>
                <Button style={{ paddingRight: 5, paddingLeft: 5 }} shape="round" type="link" onClick={props.handleViewSelected}>
                  <Icon style={{ cursor: "pointer" }} type="filter" theme="filled" />
                </Button>
              </Badge>
            </Col>
          </Row>
        )
      }
      renderItem={item => (
        <CategoryListItem
          grid={!!props.grid}
          selected={props.selectedCategories.includes(item)}
          handleSelect={props.handleSelect}
          item={item}
        />
      )}
    />
  );
};

const CategoryView = props => {

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [filterText, setFilterText] = useState("");
  const handleSelect = value => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(selectedCategories.filter(sc => sc !== value));
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  return (
    // <Loader loading={!!props.categories}>
    <>
      <CategoryList
        header={true}
        dataSource={props.categories.main}
        handleSelect={handleSelect}
        selectedCategories={selectedCategories}
        handleViewAll={() => setVisible(true)}
        handleViewSelected={() => setVisible2(true)}
        bordered={true}
      />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        centered={true}
        footer={null}
        title={
          <Input.Search
            size="large"
            placeholder="Search categories"
            style={{ width: "auto" }}
            onChange={({ target: { value } }) => setFilterText(_.toLower(value))}
          />
        }
        width={800}
      >
        <CategoryList
          grid={{ gutter: 16, column: 3 }}
          dataSource={props.categories.all.filter(d => _.toLower(d).includes(filterText))}
          handleSelect={handleSelect}
          selectedCategories={selectedCategories}
        />
      </Modal>
      <Modal
        visible={visible2}
        onCancel={() => setVisible2(false)}
        centered={true}
        footer={null}
        title={"Selected Categories"}
      >
        <CategoryList
          grid={{ gutter: 16, column: 2 }}
          dataSource={selectedCategories}
          handleSelect={handleSelect}
          selectedCategories={selectedCategories}
        />
        {!!selectedCategories.length && <Row type="flex" justify="center">
          <Button type="danger" onClick={() => { setSelectedCategories([]); setVisible2(false) }}>Reset</Button>
        </Row>}
      </Modal>
    </>
    // </Loader>
  );
};

export default CategoryView;