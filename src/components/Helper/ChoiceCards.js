import React from 'react';
import { Button, Icon } from 'antd'
import '../../scss/choice-card.scss'
import '../../scss/app.scss'
import _ from 'lodash';
import { Typography } from 'antd';

const { Title } = Typography;

export const SimpleChoiceCard = (props) => {
  const { heading, subHeading } = props;
  let params = {}
  if (props.clickIndicator && props.name) {
    const { clickIndicator, name } = props;
    params = { clickIndicator, name };
  }


  const cccn = props.centered ? "simple-choice-card centered" : "simple-choice-card";

  return (
    <div className={cccn}>
      <div className="heading">
        <span>{heading}</span>
      </div>
      <div className="body">
        <div className="sub-heading">{subHeading}</div>
        <div className="footer">
          <Button className="custom" shape={"round"} size={"large"} onClick={() => props.handleClick(...params)} >{props.btnText ? btnText : "Continue"}</Button>
        </div>
      </div>
    </div>
  )
}

export const CustomTitle = (props) => {
  return (
    <Title level={2} className="center-me custom-title" >{props.title}</Title>
  )
}

export const LiteTitle = (props) => {
  return (
    <Title level={2} className="center-me lite-title" >{props.title}</Title>
  )
}