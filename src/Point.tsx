import * as React from "react";
import { DragSource, DragSourceSpec, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";
import { getDOMRect, BORDER_WIDTH } from "./utils";

export enum DragDropType {
  DragSource = "dragSource",
  DropTarget = "dropTarget",
  Both = "both",
}

export class Coord {
  x = 0;
  y = 0;
}

export class LineCoord {
  begin = new Coord();

  end = new Coord();
}

export class PointProps {
  onDraw(relation?: [string, string]) {}

  radius? = 14;

  color? = "blue";

  style?: React.CSSProperties;

  type? = "Point";

  isDragSource? = true;

  isDropTarget? = true;

  value: string;
}

function identity<T>(el: T): T {
  return el;
}

export const Point: React.FC<PointProps> = (props) => {
  const [status, changeStatus] = React.useState("none");
  const [hasDrawed, changeHasDrawed] = React.useState(false);
  const dom = React.useRef<HTMLDivElement>();

  const [
    { isDragging, didDrop, canDrag },
    connectDragSource,
    connectDragPreview,
  ] = useDrag({
    item: { type: props.type } as any,
    begin: (monitor) => {
      return props;
    },
    end: (item, monitor) => {
      return {
        didDrop: monitor.didDrop(),
      };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
        didDrop: monitor.didDrop(),
        canDrag: monitor.canDrag(),
      };
    },
    canDrag: props.isDragSource,
  });

  const [{ isOver }, connectDropTarget] = useDrop<
    { type: string; value: string },
    any,
    any
  >({
    accept: props.type,
    canDrop: (monitor) => {
      return props.isDropTarget;
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
      };
    },
    drop: (item, monitor) => {
      changeHasDrawed(true);
      // 回调
      props.onDraw && props.onDraw([item.value, props.value]);
    },
  });

  const { radius, color, style: propStyle = {} } = props;
  React.useEffect(() => {
    connectDragPreview(getEmptyImage(), {
      captureDraggingState: true,
    });
  });

  const style = {
    position: "absolute",
    width: radius,
    height: radius,
    border: `1px solid ${color}`,
    borderRadius: radius,
    lineHeight: "12px",
    textAlign: "center",
    fontSize: 12,
    zIndex: 1,
    color,
    ...propStyle,
  } as React.CSSProperties;

  const circle = {
    width: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: color,
    position: "relative",
    margin: `${(radius - 2) / 2}px auto`,
  } as React.CSSProperties;

  let children = "+" as any;

  if (isDragging) {
    children = null;
  } else if (isOver) {
    children = <div style={circle}></div>;
  } else if (hasDrawed) {
    children = null;
  }

  return connectDropTarget(
    connectDragSource(
      <div
        style={style}
        ref={dom}
        data-value={props.value}
        className="point react-dnd-line-point"
        onMouseEnter={() => changeStatus("hover")}
        onMouseLeave={() => changeStatus("none")}
      >
        {children}
      </div>
    )
  );
};

Point.defaultProps = new PointProps();
