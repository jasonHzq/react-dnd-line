/**
 * @author jasonHzq
 * @description 终点
 */
import * as React from "react";
import { DropTarget } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Line } from "./Line";
import * as hoistStatics from "hoist-non-react-statics";
import * as ReactDOM from "react-dom";
import { getDOMRect } from "./utils";

export default function DragEnd(type, spec, collect) {
  return function(WrappedComponent) {
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || "Component";

    class DragEndComp extends React.Component {
      static displayName = `DragEnd(${wrappedComponentName})`;

      state = {
        lines: [],
        hasDrawed: false,
      };

      drawLine(item) {
        const state = this.state;

        this.setState({
          lines: [...this.state.lines, item],
        });

        this.setState({
          hasDrawed: true,
        });
      }

      componentDidMount() {
        this._renderOverlay();
      }

      rect = null as ReturnType<typeof getDOMRect>;
      overlayTarget = null;

      componentDidUpdate(prevProps, prevState) {
        const dom = ReactDOM.findDOMNode(this.refs.wrapped) as HTMLDivElement;
        const rect = getDOMRect(dom);

        this.rect = rect;
        this._renderOverlay();
      }

      componentWillUnmount() {
        if (this.overlayTarget) {
          document.body.removeChild(this.overlayTarget);
          this.overlayTarget = null;
        }
      }

      _renderOverlay() {
        if (!this.overlayTarget) {
          this.overlayTarget = document.createElement("div");

          document.body.appendChild(this.overlayTarget);
        }

        ReactDOM.render(<div>{this.renderOverlay()}</div>, this.overlayTarget);
      }

      renderOverlay() {
        const { lines } = this.state;

        if (!this.rect) {
          return null;
        }

        const { left, top, width, height } = this.rect;

        const end = {
          x: left + width / 2,
          y: top + height / 2,
        };

        return lines.map((item, index) => {
          const begin = {
            x: item.left + item.width / 2,
            y: item.top + item.height / 2,
          };

          return (
            <Line
              key={`line-${index}`}
              begin={begin}
              end={end}
              {...item.line}
            />
          );
        });
      }

      render() {
        return (
          <div>
            {React.createElement(WrappedComponent, {
              ...this.props,
              ref: "wrapped",
              hasDrawed: this.state.hasDrawed,
            })}
          </div>
        );
      }
    }

    const finalSpec = {
      ...spec,
      drop(props, monitor, component, ...rest) {
        // 画一条保存线。
        const item = monitor.getItem();

        item.setHasDrawed();
        component.drawLine(item);

        // 回调
        props.onDraw && props.onDraw(item);

        if (spec.drop) {
          return spec.drop(props, monitor, component, ...rest);
        }
      },
    };

    return DropTarget(
      type,
      finalSpec,
      collect
    )(hoistStatics(DragEndComp, WrappedComponent));
  };
}
