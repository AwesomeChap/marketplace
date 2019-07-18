import React from 'react';
import { Button, Icon } from 'antd'
import '../../scss/choice-card.scss'
import '../../scss/app.scss'
import _ from 'lodash';
import { Typography } from 'antd';

const { Title } = Typography;

export const SimpleChoiceCard = (props) => {
  const { heading, subHeading, clickIndicator, name } = props;
  return (
    <div className="simple-choice-card">
      <div className="heading">
        <span>{heading}</span>
      </div>
      <div className="body">
        <div className="sub-heading">{subHeading}</div>
        <div className="footer">
          <Button className="custom" shape={"round"} size={"large"} onClick={() => props.handleClick(clickIndicator, name)} >{props.btnText ? btnText : "Continue"}</Button>
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