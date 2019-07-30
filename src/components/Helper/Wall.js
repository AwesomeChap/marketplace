import React, { useState } from "react";
import { Rnd } from "react-rnd";
import '../../scss/layout.scss';

const Wall = props => {
  const [height, setHeight] = useState(200);
  const [width, setWidth] = useState(100);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  
  return (
    <Rnd
      className="wall"
      // dragGrid={[25,25]}
      resizeGrid={[25,25]}
      bounds={['body']}
      size={{ width: width, height: height }}
      position={{ x: x, y: y }}
      bounds={['.layout']}
      onDragStop={(e, d) => {
        setX(d.x);
        setY(d.y);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setWidth(ref.offsetWidth);
        setHeight(ref.offsetHeight);
      }}
    >
    </Rnd>
  );
};

export default Wall;
