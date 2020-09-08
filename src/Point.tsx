import * as React from "react";
import { DragSource } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";
import DragEnd from "./DragEnd";
import { getDOMRect } from "./utils";

export class PointProps {
  x = 0;

  y = 0;

  onDraw() {}

  radius = 8;

  color = "blue";

  connectDragPreview?: any;

  isDragging?: boolean;

  isOver?: boolean;

  connectDragSource?: any;

  connectDropTarget?: any;

  style?: React.CSSProperties;

  hasDrawed?: boolean;
}

function identity<T>(el: T): T {
  return el;
}

export function getPoint(options: {
  type: string;
  sourceType?: string;
  targetType?: string;
}) {
  const { type, sourceType, targetType } = options;

  const beginSpec = {
    beginDrag(props, monitor, component) {
      const dom = findDOMNode(component) as HTMLDivElement;
      const rect = (dom && getDOMRect(dom)) || ({} as any);
      const { width = 0, height = 0, top = 0, left = 0 } = rect;
      const { line = {} } = props;

      return {
        ...props,
        left,
        top,
        line,
        width,
        height,
        setHasDrawed() {
          component.setHasDrawed();
        },
      };
    },
  };

  class Point extends React.Component<PointProps> {
    static defaultProps = new PointProps();

    componentDidMount() {
      const { connectDragPreview = identity } = this.props;

      connectDragPreview(getEmptyImage(), {
        captureDraggingState: true,
      });
    }

    state = {
      status: "none",
      hasDrawed: false,
    };

    setHasDrawed = () => {
      this.setState({
        hasDrawed: true,
      });
    };

    handleHover = () => {
      this.setState({
        status: "hover",
      });
    };

    handleDeHover = () => {
      this.setState({
        status: "none",
      });
    };

    render() {
      const {
        radius,
        connectDragSource = identity,
        connectDropTarget = identity,
        isDragging,
        color,
        isOver,
        style: propStyle = {},
      } = this.props;
      const { status } = this.state;

      const style = {
        position: "absolute",
        width: radius,
        height: radius,
        border: `1px solid ${color}`,
        borderRadius: radius,
        lineHeight: "10px",
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
      } else if (this.state.hasDrawed || this.props.hasDrawed) {
        children = null;
      }

      return connectDropTarget(
        connectDragSource(
          <div
            style={style}
            className="point"
            onMouseEnter={this.handleHover}
            onMouseLeave={this.handleDeHover}
          >
            {children}
          </div>
        )
      );
    }
  }

  let FinalPoint = Point as any;

  if (sourceType || type) {
    FinalPoint = DragSource(
      sourceType || type,
      beginSpec,
      (connect, monitor) => {
        return {
          isDragging: monitor.isDragging(),
          didDrop: monitor.didDrop(),
          connectDragSource: connect.dragSource(),
          connectDragPreview: connect.dragPreview(),
        };
      }
    )(Point);
  }

  if (targetType || type) {
    FinalPoint = DragEnd(targetType || type, {}, (connect, monitor) => {
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
      };
    })(FinalPoint);
  }

  if (!sourceType && !type && !targetType) {
    throw new Error("you must set type");
  }

  return FinalPoint;
}

export default getPoint({ type: "Point" });
