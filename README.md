# react-dnd-line

draw lines in div elements

[![npm version](https://badge.fury.io/js/react-dnd-line.png)](https://badge.fury.io/js/react-dnd-line)
[![npm downloads](https://img.shields.io/npm/dt/react-dnd-line.svg?style=flat-square)](https://www.npmjs.com/package/react-dnd-line)

## install

```sh
$ npm i -S react-dnd-line
```

## Usage

```jsx
import { Point, LineBackend, getPoint } from "react-dnd-line";

const SourcePoint = getPoint({ sourceType: "Point" });
const TargetPoint = getPoint({ targetType: "Point" });

class App extends Component {
  render() {
    return (
      <LineBackend>
        <SourcePoint />
        <TargetPoint />
      </LineBackend>
    );
  }
}
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2015-2016 Recharts Group
