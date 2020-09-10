import React, { Component } from "react";
import { Point, getPoint, LineBackend } from "react-dnd-line";
import ReactDOM from "react-dom";

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
    lines: [],
    shouldShowPoints: true,
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

  render() {
    const points = this.state.points.map((point, pointIndex) => {
      return (
        <div key={pointIndex}>
          <Point
            key={`point-source-${pointIndex}`}
            color="red"
            type="point"
            isDropTarget={false}
            line={{ color: "red" }}
            onDraw={this.handleDraw.bind(this)}
            style={{
              left: point.x + 20,
              top: point.y + 20,
            }}
          />
          <Point
            key={`point-target-${pointIndex}`}
            color="green"
            isDragSource={false}
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
            <LineBackend lines={this.state.lines}>
              <Point
                color="yellow"
                line={{ color: "yellow" }}
                type="point"
                onDraw={this.handleDraw.bind(this)}
                style={{
                  left: 20,
                  top: 20,
                }}
              />
              {points}
            </LineBackend>
          </div>
        ) : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
