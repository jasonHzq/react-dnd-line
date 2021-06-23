import * as React from "react";
import { Line, LineProps } from "./Line";
import { getLines, Rect } from "./utils";

export class LinesProps {
  lines = [] as Array<[string, string]>;

  color? = "blue";

  strokeWidth? = 2;

  radius? = 2;

  points = [] as Rect[];

  getLineProps? = (line: [string, string]): LineProps => {
    return {};
  };
}

export const Lines: React.FC<LinesProps> = (props) => {
  const { lines, points, getLineProps, ...restProps } = props;

  return (
    <>
      {lines.map((line, index) => {
        const { begin, end } = getLines(line, points);
        const lineProps = getLineProps(line);

        return (
          <Line
            key={index}
            begin={begin}
            end={end}
            {...restProps}
            {...lineProps}
          />
        );
      })}
    </>
  );
};

Lines.defaultProps = new LinesProps();
