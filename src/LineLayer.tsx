/**
 * 拖拽时画的线
 */
import * as React from "react";
import { DragLayer, useDragLayer } from "react-dnd";
import { Line } from "./Line";
import * as ReactDOM from "react-dom";
import { BORDER_WIDTH, getPosition, getDOMRect, Rect } from "./utils";

class LineLayerProps {
  color? = "blue";

  strokeWidth? = 2;

  radius? = 2;

  getDOMRect: () => Rect;

  width = 16;

  height = 16;

  points = [] as Rect[];
}

export const LineLayer: React.FC<LineLayerProps> = (props) => {
  const { item, itemType, isDragging, currentOffset } = useDragLayer(
    (monitor) => {
      return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
      };
    }
  );

  if (!item || !currentOffset || !isDragging) {
    return <div></div>;
  }

  const { value } = item;

  console.log(value, props.points);
  const begin = getPosition(value, props.points);
  const containerBox = props.getDOMRect();

  const end = {
    x: currentOffset.x - containerBox.left + props.width / 2 + BORDER_WIDTH,
    y: currentOffset.y - containerBox.top + props.height / 2 + BORDER_WIDTH,
  };

  return <Line begin={begin} end={end} {...props} />;
};

LineLayer.defaultProps = new LineLayerProps();
