/**
 * @author 奇阳
 * @description 线条组件
 */
import * as React from "react";

export class LineProps {
  begin? = { x: 0, y: 0 };

  end? = { x: 50, y: 50 };

  color? = "blue";

  strokeWidth? = 2;

  radius? = 2;
}

export const Line: React.FC<LineProps> = (props) => {
  const { begin, end, radius, color, ...rest } = props;
  const { x: x1, y: y1 } = begin;
  const { x: x2, y: y2 } = end;

  const width = Math.abs(x2 - x1) + radius * 2;
  const height = Math.abs(y2 - y1) + radius * 2;
  const left = Math.min(x1, x2) - radius;
  const top = Math.min(y1, y2) - radius;

  return (
    <svg
      style={{
        position: "absolute",
        left: left,
        top: top,
      }}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <circle cx={x1 - left} cy={y1 - top} r={radius} fill={color} />
      <line
        x1={x1 - left}
        y1={y1 - top}
        x2={x2 - left}
        y2={y2 - top}
        stroke={color}
        {...rest}
      />
      <circle cx={x2 - left} cy={y2 - top} r={radius} fill={color} />
    </svg>
  );
};

Line.defaultProps = new LineProps();
