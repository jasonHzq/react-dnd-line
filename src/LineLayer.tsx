/**
 * 拖拽时画的线
 */
import * as React from "react";
import { DragLayer, useDragLayer } from "react-dnd";
import { Line } from "./Line";
import * as ReactDOM from "react-dom";
import { ContainerContext, BORDER_WIDTH } from "./utils";

class LineLayerProps {
  color = "blue";

  strokeWidth = 2;

  radius = 2;
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
  const containerBox = React.useContext(ContainerContext);
  console.log("containerBox", containerBox);
  if (!item || !currentOffset || !isDragging) {
    return <div></div>;
  }

  const { width, height, left, top } = item;
  const begin = {
    x: left + width / 2 + BORDER_WIDTH,
    y: top + height / 2 + BORDER_WIDTH,
  };
  const end = {
    x: currentOffset.x - containerBox.left + width / 2 + BORDER_WIDTH,
    y: currentOffset.y - containerBox.top + height / 2 + BORDER_WIDTH,
  };

  return <Line begin={begin} end={end} {...props} />;
};

LineLayer.defaultProps = new LineLayerProps();
