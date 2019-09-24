import React, { useEffect, useState } from "react";
import {
  Row, Col, Icon, Typography, Table,
  Input, Descriptions, Affix, Tooltip
} from "antd";
import { iconFontCNUrl } from "../../../../keys";
import Animate from 'rc-animate';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: iconFontCNUrl
});

const columns = [
  {
    title: "Key Name",
    dataIndex: "keyName",
    key: "keyName"
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value"
  }
];

const { Title, Paragraph } = Typography;

const Tag1 = props => {
  return (
    <span
      style={{
        background: "#fff2",
        marginRight: 8,
        padding: "4px 8px",
        border: "1px dashed #999"
      }}
    >
      {props.children}
    </span>
  );
};

// style={{ background: "#001529", color: "#fff" }}

const RestaurantTopBar = props => {

  const [dishSearchText, setDishSearchText] = useState("");

  console.log(props);

  const dataSource = [
    {
      key: "1",
      keyName: "Cost For One",
      value: [`£${props.rst.profile.costForOne}`]
    },
    {
      key: "2",
      keyName: "Services",
      value: props.rst.profile.serviceOptions
    },
    {
      key: "3",
      keyName: "Phone",
      value: props.rst.profile.contact.phoneNumbers
    },
    {
      key: "4",
      keyName: "Email",
      value: [props.rst.profile.contact.email]
    },
    {
      key: "5",
      keyName: "Offer",
      value: !!props.rst.profile.discount ? [`${props.rst.profile.discount}% off when you spend £${props.rst.profile.discountMinOrder}`] : []
    }
  ];

  return (
    <div className="restaurant-top-bar wrapper">

      <div className="container">
        <Row type="flex">
          <Col style={{ padding: "16px 16px 16px 0px" }}>

            {/* <Animate transitionName="fade"> */}
            {!props.shrinkTopBar && (<div
              style={{
                height: 120,
                width: 120,
                background: "#fff4",
                marginBottom: 8
              }}
            >
              <img style={{width: "100%"}} src={props.rst.logoUrl} alt=""/>
            </div>)}
            {/* </Animate> */}

            <Row style={{ width: 120, padding: "6px 0" }} type="flex" justify="space-between" align="middle">
              {props.shrinkTopBar && <Col>
                <img src={props.rst.logoUrl} style={{width: 20, transform: "scale(2)"}} alt=""/>
              </Col>}
              <Col>
                <Icon type="star" theme="filled" /> <b>3.3</b>
              </Col>
              {!props.shrinkTopBar && <Col>
                <span style={{ opacity: 0.6, fontSize: 13 }}>597 Ratings</span>
              </Col>}
            </Row>
          </Col>
          <Col span={10} style={{ padding: 5 }}>
            {/* <Animate transitionName="fade"> */}
            {!props.shrinkTopBar &&
              <div
                style={{ color: "#fff", fontSize: 28, marginBottom: 0 }}
                level={2}
              >
                {props.rst.restaurantName}{" "}
                <div style={{
                  display: "inline-block", fontSize: 14,
                  background: "green", marginLeft: 16,
                  transform: "translate(0,-25%)", padding: "2px 8px"
                }}>
                  Open
              </div>
                {!props.rst.profile.smokingAllowed && <Tooltip title={"No Smoking"}>
                  <IconFont
                    style={{
                      fontSize: 18,
                      marginLeft: 16,
                      padding: "3px 0px",
                      color: "#fff"
                    }}
                    type="icon--no-smoking"
                  />
                </Tooltip>}
                {!props.rst.profile.alcohol.allowed && <Tooltip title="No Alcohol">
                  <IconFont
                    style={{
                      fontSize: 18,
                      marginLeft: 16,
                      padding: "3px 0px",
                      color: "#fff"
                    }}
                    type="icon-icons-no_alcohol"
                  />
                </Tooltip>}
                <Tooltip title="Pure Veg">
                  <IconFont
                    style={{
                      fontSize: 18,
                      marginLeft: 16, 
                      padding: "3px 0px",
                      color: "#fff"
                    }}
                    type="icon-leaf"
                  />
                </Tooltip>
              </div>}
            {/* </Animate> */}
            {/* <Animate transitionName="fade"> */}
            {!props.shrinkTopBar && (
              <div
                style={{ color: "#fff", opacity: 0.6, marginBottom: 26 }}
                ellipsis
              >
                {props.rst.profile.address}
              </div>
            )}
            {/* </Animate> */}
            {/* <Animate transitionName="fade"> */}
            {!props.shrinkTopBar && (
              <div style={{ marginBottom: 10 }}>
                {props.rst.categories.main.map(cat => (
                  <Tag1>{cat}</Tag1>
                ))}
              </div>
            )}
            {/* </Animate> */}
            <Input
              value={dishSearchText}
              onChange = {({target: {value}}) => setDishSearchText(value)}
              style={{
                borderRadius: 0,
                width: 280,
                bottom: 16,
                position: "absolute"
              }}
              placeholder="Search dishes"
            // prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            // suffix={<Icon type="arrow-right" style={{ color: "rgba(0,0,0,.45)" }} />}
            />
          </Col>
          <Col span={10} style={{ padding: "16px 0px 16px 16px" }}>
            <table>
              {!props.shrinkTopBar ? dataSource.map((ds, i) => (
                <tr>
                  <td style={{ padding: 6, fontWeight: 600 }}>{ds.keyName}</td>
                  <td>
                    {ds.value.map(val => (
                      <span
                        style={{
                          color: "#fff",
                          background: "#fff2",
                          padding: "3px 10px",
                          marginRight: 8
                        }}
                      >
                        {val}
                      </span>
                    ))}
                  </td>
                </tr>
              )) : <tr>
                  <td style={{ padding: 6, fontWeight: 600 }}>{dataSource[2].keyName}</td>
                  <td>
                    {dataSource[2].value.map(val => (
                      <span
                        style={{
                          color: "#fff",
                          background: "#fff2",
                          padding: "3px 10px",
                          marginRight: 8
                        }}
                      >
                        {val}
                      </span>
                    ))}
                  </td>
                </tr>}
            </table>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RestaurantTopBar;
