import React, { useState } from "react";
import { InputNumber, Input, Button, Select, Icon } from "antd";
import { Rnd } from "react-rnd";
import '../../scss/table.scss';
import uuidv4 from 'uuid/v4';

const { Option } = Select;

const Seats = props => {
  return (
    <React.Fragment>
      <div className={props.mode === "vertical" ? "seat-row vt-lt" : "seat-row hz-top"}>
        <div className="seat" />
        {props.seatCount >= 4 && <div className="seat" />}
        {props.seatCount >= 8 && <div className="seat" />}
        {props.seatCount === 10 && <div className="seat" />}
      </div>
      {props.seatCount >= 6 && (
        <div className={props.mode === "vertical" ? "seat-row hz-bm" : "seat-row vt-rt"}>
          <div className="seat" />
        </div>
      )}
      <div className={props.mode === "vertical" ? "seat-row vt-rt" : "seat-row hz-bm"}>
        <div className="seat" />
        {props.seatCount >= 4 && <div className="seat" />}
        {props.seatCount >= 8 && <div className="seat" />}
        {props.seatCount === 10 && <div className="seat" />}
      </div>
      {props.seatCount >= 6 && (
        <div className={props.mode === "vertical" ? "seat-row hz-top" : "seat-row vt-lt"}>
          <div className="seat" />
        </div>
      )}
    </React.Fragment>
  );
};

const StandardTable = props => {
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
      //   dragGrid={[25,25]}
      enableResizing={{
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      }}
      resizeGrid={[25, 25]}
      bounds={[".layout"]}
      position={{ x: x, y: y }}
      onDragStop={(e, d) => {
        setX(d.x);
        setY(d.y);
      }}
    >
      <div className={props.mode === "vertical" ? (seatCount <= 6 ? "vt-table table small-table" : "vt-table table") : (seatCount <= 6 ? "table small-table" : "table")}>
        {props.children}
        <Seats mode={props.mode} seatCount={seatCount} />
        <Input disabled={true} size="small" className="name" value={props.lc.name} />
        <Select
          size="small"
          labelInValue
          defaultValue={{ key: seatCount }}
          onChange={e => setSeatCount(e.key)}
        >
          {seatCountOptions.map((sc, i) => (
            <Option key={sc+i} value={sc}>{`${sc} seats`}</Option>
          ))}
        </Select>
      </div>
    </Rnd>
  );
};

export default StandardTable;
