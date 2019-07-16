import React from 'react';
import { Spin } from 'antd';
import '../../scss/app.scss'

const Loader = (props) => {
  if (props.children) {
    return (
      <Spin spinning={props.loading} size={props.type ? props.type : "large"}>{props.children}</Spin>
    )
  }
  return (
    <div className="loader-wrapper" >
      <Spin size={props.type ? props.type : "large"} />
    </div>
  )
}

export default Loader;