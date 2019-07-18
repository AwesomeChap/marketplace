import React from 'react';
import '../../scss/choice-card.scss';
import { CustomTitle } from './ChoiceCards';

const ConfigForm = (props) => {
  return (
    <div className="config-form">
      <div className="config-header"> <CustomTitle title={props.title} /></div>
      <div className="config-body">{props.children}</div>
    </div>
  )
}

export default ConfigForm;
