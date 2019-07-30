import React, { useState } from "react";
import { InputNumber, Input, Button, Select } from "antd";
import { Rnd } from "react-rnd";
import '../../scss/table.scss';

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
  const [seatCount, setSeatCount] = useState(2);
  const mode = props.mode || "horizontal";
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const seatCountOptions = [2, 4, 6, 8, 10];

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
      <div className={mode === "vertical" ? "vt-table table": "table"}>
        <Seats mode={mode} seatCount={seatCount} />
        <Input size="small" value={`Table ${1}`} />
        <Select
          size="small"
          labelInValue
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

export default StandardTable;
