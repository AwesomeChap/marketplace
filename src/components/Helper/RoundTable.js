import React, { useState } from "react";
import { Input, Select } from "antd";
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
  const [seatCount, setSeatCount] = useState(10);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const seatCountOptions = [2, 4, 6, 8, 10];

  React.useEffect(() => {
    console.log(x, y)
  }, [x, y]);

  return (
    <Rnd
      //   dragGrid={[25,25]}
      enableResizing={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false}}
      resizeGrid={[25, 25]}
      bounds={["body"]}
      position={{ x: x, y: y }}
      onDragStop={(e, d) => {
        setX(d.x);
        setY(d.y);
      }}
    >
      <div className="round-table">
        <Seats seatCount={seatCount} />
        <Input size="small" value={`Table ${1}`} />
        <Select
          labelInValue
          size="small"
          defaultValue={{ key: seatCount }}
          // style={{ width: 120 }}
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
