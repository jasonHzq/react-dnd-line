import React, { Component } from "react";
import { Point, getPoint, LineBackend } from "react-dnd-line";
import ReactDOM from "react-dom";
import "./index.scss";

function repeat(target, repeatNum) {
  if (!repeatNum) {
    return [];
  }

  if (repeatNum < 0) {
    throw Error("repeatNum should be positive in repeat function");
  }

  return [target, ...repeat(target, repeatNum - 1)];
}

function toInt(num) {
  return parseInt(num, 10);
}

const MAX = 500;

class App extends Component {
  state = {
    points: repeat({}, 80).map((pos) => {
      return {
        x: toInt(Math.random() * MAX),
        y: toInt(Math.random() * MAX),
      };
    }),
    lines: [],
    shouldShowPoints: true,
    hoveredPoint: null,
  };

  handleDraw(line) {
    console.log(line);
    this.setState({
      lines: [...this.state.lines, line],
    });
  }

  componentDidCatch(error) {
    console.error(error);
  }

  getLineProps = (line) => {
    if ((line || []).includes(this.state.hoveredPoint)) {
      return { color: "red", stroke: "2px" };
    }
    return {};
  };

  render() {
    const points = this.state.points.map((point, pointIndex) => {
      return (
        <div key={pointIndex}>
          <Point
            value={`point-source-${pointIndex}`}
            color="red"
            type="point"
            isDropTarget={false}
            line={{ color: "red" }}
            onMouseEnter={() => {
              this.setState({
                hoveredPoint: `point-source-${pointIndex}`,
              });
            }}
            onMouseLeave={() => {
              this.setState({
                hoveredPoint: null,
              });
            }}
            onDraw={this.handleDraw.bind(this)}
            style={{
              left: point.x + 20,
              top: point.y + 20,
            }}
          />
          <Point
            value={`point-target-${pointIndex}`}
            color="green"
            isDragSource={false}
            onMouseEnter={() => {
              this.setState({
                hoveredPoint: `point-target-${pointIndex}`,
              });
            }}
            onMouseLeave={() => {
              this.setState({
                hoveredPoint: null,
              });
            }}
            type="point"
            line={{ color: "green" }}
            onDraw={this.handleDraw.bind(this)}
            style={{
              left: point.x,
              top: point.y,
            }}
          />
        </div>
      );
    });

    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              shouldShowPoints: !this.state.shouldShowPoints,
            });
          }}
        >
          click me
        </button>

        {this.state.shouldShowPoints ? (
          <div style={{ position: "relative", left: 200, width: 400 }}>
            <LineBackend
              getLineProps={this.getLineProps}
              lines={this.state.lines}
            >
              {points}
            </LineBackend>
          </div>
        ) : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
