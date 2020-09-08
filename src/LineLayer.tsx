import * as React from "react";
import { DragLayer } from "react-dnd";
import { Line } from "./Line";
import * as ReactDOM from "react-dom";

class LineLayerProps {
  item?: any;

  itemType?: string;

  isDragging?: boolean;

  currentOffset?: any;
}

const collect = (monitor: any, props): any => {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  } as any;
};

class LineLayerComp extends React.Component<LineLayerProps> {
  overlayTarget = null as HTMLDivElement;

  renderOverlay() {
    if (!this.overlayTarget) {
      this.overlayTarget = document.createElement("div");

      document.body.appendChild(this.overlayTarget);
    }

    const { item, itemType, isDragging, currentOffset } = this.props;

    if (!item || !currentOffset || !isDragging) {
      ReactDOM.render(<div></div>, this.overlayTarget);
      return;
    }

    const { width, height, left, top, line } = item;
    const begin = {
      x: left + width / 2,
      y: top + height / 2,
    };
    const end = {
      x: currentOffset.x + width / 2 + document.body.scrollLeft,
      y: currentOffset.y + height / 2 + document.body.scrollTop,
    };

    ReactDOM.render(
      <Line begin={begin} end={end} {...line} />,
      this.overlayTarget
    );
  }

  componentDidUpdate(prevProps, prevState) {
    this.renderOverlay();
  }

  componentWillUnmount() {
    if (this.overlayTarget) {
      document.body.removeChild(this.overlayTarget);
      this.overlayTarget = null;
    }
  }

  componentDidMount() {
    this.renderOverlay();
  }

  render() {
    return null;
  }
}

export const LineLayer = DragLayer(collect)(LineLayerComp);
