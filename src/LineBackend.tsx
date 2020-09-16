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
import { getLines, getDOMRect, Rect, getDiffRect } from "./utils";
import { LineCoord } from "./Point";

export class LineBackendProps {
  lines = [] as Array<[string, string]>;

  color? = "blue";

  strokeWidth? = 2;

  radius? = 2;
}

export const LineBackend: React.FC<LineBackendProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>();
  const { lines, ...restProps } = props;
  const [points, changePoints] = React.useState([]);

  React.useEffect(() => {
    const rect = getDOMRect(ref?.current);
    const pointDOMs = ref.current?.querySelectorAll(".react-dnd-line-point");
    const points = Array.from(pointDOMs || []).map(
      (pointDOM: HTMLDivElement) => {
        return {
          ...getDiffRect(getDOMRect(pointDOM), rect),
          value: pointDOM?.dataset?.value || "",
        };
      }
    );
    changePoints(points);
  }, [props.lines]);

  return (
    <DndProvider backend={HTML5Backend as any}>
      <div style={{ position: "relative" }} ref={ref}>
        {props.children}
        <div
          className="line-overlay-target"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <LineLayer
            points={points}
            width={16}
            height={16}
            getDOMRect={() => getDOMRect(ref.current)}
            {...restProps}
          />
          <Lines points={points} {...props} />
        </div>
      </div>
    </DndProvider>
  );
};

LineBackend.defaultProps = new LineBackendProps();

export class LinesProps {
  lines = [] as Array<[string, string]>;

  color? = "blue";

  strokeWidth? = 2;

  radius? = 2;

  points = [] as Rect[];
}

export const Lines: React.FC<LinesProps> = (props) => {
  const { lines, points, ...restProps } = props;

  return (
    <>
      {lines.map((line, index) => {
        const lineProps = getLines(line, points);

        return <Line key={index} {...lineProps} {...restProps} />;
      })}
    </>
  );
};

Lines.defaultProps = new LinesProps();
