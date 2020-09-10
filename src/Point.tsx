import * as React from "react";
import { DragSource, DragSourceSpec, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";
import { getDOMRect, ContainerContext, BORDER_WIDTH } from "./utils";

export enum DragDropType {
  DragSource = "dragSource",
  DropTarget = "dropTarget",
  Both = "both",
}

export class Corrd {
  x = 0;
  y = 0;
}

export class LineCorrd {
  begin = new Corrd();

  end = new Corrd();
}

export class PointProps {
  x = 0;

  y = 0;

  onDraw(line: LineCorrd) {}

  radius = 14;

  color = "blue";

  style?: React.CSSProperties;

  hasDrawed?: boolean;

  type: string;

  isDragSource = true;

  isDropTarget = true;
}

function identity<T>(el: T): T {
  return el;
}

export const Point: React.FC<PointProps> = (props) => {
  const [status, changeStatus] = React.useState("none");
  const [hasDrawed, changeHasDrawed] = React.useState(false);
  const containerBox = React.useContext(ContainerContext);
  const dom = React.useRef<HTMLDivElement>();
  const rect = dom?.current?.getBoundingClientRect();

  const [
    { isDragging, didDrop, canDrag },
    connectDragSource,
    connectDragPreview,
  ] = useDrag({
    item: { type: props.type } as any,
    begin: (monitor) => {
      const position = {
        left: rect.left - containerBox.left,
        top: rect.top - containerBox.top,
      };
      console.log(position);

      return {
        ...props,
        ...position,
        width: props.radius,
        height: props.radius,
      };
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
    { left: number; top: number; type: string },
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
      props.onDraw &&
        props.onDraw({
          begin: {
            x: item.left + props.radius / 2 + BORDER_WIDTH,
            y: item.top + props.radius / 2 + BORDER_WIDTH,
          },
          end: {
            x:
              (rect?.left || 0) -
              containerBox.left +
              props.radius / 2 +
              BORDER_WIDTH,
            y:
              (rect?.top || 0) -
              containerBox.top +
              props.radius / 2 +
              BORDER_WIDTH,
          },
        });
    },
  });

  React.useEffect(() => {
    connectDragPreview(getEmptyImage(), {
      captureDraggingState: true,
    });
  });

  const { radius, color, style: propStyle = {} } = props;

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
        className="point"
        onMouseEnter={() => changeStatus("hover")}
        onMouseLeave={() => changeStatus("none")}
      >
        {children}
      </div>
    )
  );
};

Point.defaultProps = new PointProps();
