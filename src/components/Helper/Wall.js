import React, { useState } from "react";
import { Rnd } from "react-rnd";
import '../../scss/layout.scss';

const Wall = props => {
  const [height, setHeight] = useState(props.lc.height || 200);
  const [width, setWidth] = useState(props.lc.width || 100);
  const [x, setX] = useState(props.lc.x || 0);
  const [y, setY] = useState(props.lc.y || 0);

  React.useEffect(() => {
    const values = { x, y, height, width }
    const key = props.lc.key;
    props.handleChange(key, values)
  }, [x, y, height, width]);

  return (
    <Rnd
      className="wall"
      // dragGrid={[25,25]}
      resizeGrid={[25, 25]}
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
      {props.children}
    </Rnd>
  );
};

export default Wall;
