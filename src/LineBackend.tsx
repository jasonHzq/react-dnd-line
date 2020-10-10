/**
 * @author jasonHzq
 * @description backend
 */
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Line } from "./Line";
import { LineLayer } from "./LineLayer";
import { debounce, getDiffRect, getDOMRect, getLines, Rect } from "./utils";

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

  const updatePoints = () => {
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
  };

  React.useEffect(() => {
    updatePoints();
  }, [props.lines]);

  const measuredRef = React.useCallback((node) => {
    if (node) {
      const nodeObserver = new MutationObserver(
        debounce((mutationsList) => {
          if (mutationsList.length) {
            updatePoints();
          }
        }, 100)
      );

      const config = { childList: true, subtree: true };
      nodeObserver.observe(node, config);
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend as any}>
      <div style={{ position: "relative" }} ref={ref}>
        <div ref={measuredRef}>{props.children}</div>
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
