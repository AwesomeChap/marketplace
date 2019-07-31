import React, { useState } from "react";
import { Input, Select, Icon } from "antd";
import { Rnd } from "react-rnd";
import '../../scss/layout.scss';

const { Option } = Select;

const Seats = props => {
  return (
    <React.Fragment>
      <div class={`seat-circular-row seats-count-${props.seatCount}`}>
        <div className="seat" />
        <div className="seat" />
        {props.seatCount >= 4 && <div className="seat" />}
        {props.seatCount >= 4 && <div className="seat" />}
        {props.seatCount >= 6 && <div className="seat" />}
        {props.seatCount >= 6 && <div className="seat" />}
        {props.seatCount >= 8 && <div className="seat" />}
        {props.seatCount >= 8 && <div className="seat" />}
        {props.seatCount === 10 && <div className="seat" />}
        {props.seatCount === 10 && <div className="seat" />}
      </div>
    </React.Fragment>
  );
};

const RoundTable = props => {
  const [seatCount, setSeatCount] = useState(props.lc.seatCount || 2);
  const [x, setX] = useState(props.lc.x || 0);
  const [y, setY] = useState(props.lc.y || 0);

  const seatCountOptions = [2, 4, 6, 8, 10];

  React.useEffect(() => {
    const values = { x, y, seatCount }
    const key = props.lc.key;
    props.handleChange(key, values)
  }, [x, y, seatCount]);

  return (
    <Rnd
      enableResizing={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
      bounds={[".layout"]}
      position={{ x: x, y: y }}
      onDragStop={(e, d) => {
        setX(d.x);
        setY(d.y);
      }}
    >
      <div className={seatCount <= 6 ? "round-table small-table" : "round-table"}>
        {props.children}
        <Seats seatCount={seatCount} />
        <Input disabled={true} size="small" className="name" value={props.lc.name} />
        <Select
          labelInValue
          size="small"
          defaultValue={{ key: seatCount }}
          onChange={e => setSeatCount(e.key)}
        >
          {seatCountOptions.map((sc, i) => (
            <Option value={sc}>{`${sc} seats`}</Option>
          ))}
        </Select>
      </div>
    </Rnd>
  );
};

export default RoundTable;
