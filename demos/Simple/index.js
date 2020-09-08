import React, { Component } from "react";
import { Point, getPoint, LineBackend } from "react-dnd-line";
import ReactDOM from "react-dom";

const SourcePoint = getPoint({ sourceType: "Point" });
const TargetPoint = getPoint({ targetType: "Point" });

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
    points: repeat({}, 10).map((pos) => {
      return {
        x: toInt(Math.random() * MAX),
        y: toInt(Math.random() * MAX),
      };
    }),
  };

  handleDraw(point, origin) {
    console.log(point, origin);
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    const points = this.state.points.map((point, pointIndex) => {
      return (
        <div key={pointIndex}>
          <SourcePoint
            key={`point-source-${pointIndex}`}
            color="red"
            line={{ color: "red" }}
            onDraw={this.handleDraw.bind(this, point)}
            style={{
              left: point.x + 20,
              top: point.y + 20,
            }}
          />
          <TargetPoint
            key={`point-target-${pointIndex}`}
            color="green"
            line={{ color: "green" }}
            onDraw={this.handleDraw.bind(this, point)}
            style={{
              left: point.x,
              top: point.y,
            }}
          />
        </div>
      );
    });

    return (
      <LineBackend>
        <div style={{ position: "relative", left: 200 }}>
          <Point
            color="yellow"
            line={{ color: "yellow" }}
            onDraw={this.handleDraw.bind(this, { x: 20, y: 20 })}
            style={{
              left: 20,
              top: 20,
            }}
          />
          {points}
        </div>
      </LineBackend>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
