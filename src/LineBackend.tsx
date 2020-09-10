/**
 * @author jasonHzq
 * @description backend
 */
import * as React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import * as hoistStatics from "hoist-non-react-statics";
import { LineLayer } from "./LineLayer";
import { LineProps, Line } from "./Line";
import { ContainerContext } from "./utils";
import { LineCoord } from "./Point";

export class LineBackendProps {
  lines = [] as LineCoord[];

  color? = "blue";

  strokeWidth? = 2;

  radius? = 2;
}

export const LineBackend: React.FC<LineBackendProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>();
  const [containerBox, changeBox] = React.useState({
    left: 0,
    top: 0,
  });
  React.useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    changeBox({
      left: rect.left,
      top: rect.top,
    });
  }, []);
  const { lines, ...restProps } = props;

  return (
    <DndProvider backend={HTML5Backend as any}>
      <ContainerContext.Provider value={containerBox}>
        <div style={{ position: "relative" }} ref={ref}>
          {props.children}
          <div
            className="line-overlay-target"
            style={{ position: "absolute", left: 0, top: 0, zIndex: 9999 }}
          >
            <LineLayer {...restProps} />
            {props.lines.map((lineProps, index) => {
              return <Line key={index} {...lineProps} {...restProps} />;
            })}
          </div>
        </div>
      </ContainerContext.Provider>
    </DndProvider>
  );
};

LineBackend.defaultProps = new LineBackendProps();
