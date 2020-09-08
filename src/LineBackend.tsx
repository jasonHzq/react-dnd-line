/**
 * @author jasonHzq
 * @description backend
 */
import * as React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import * as hoistStatics from "hoist-non-react-statics";
import { LineLayer } from "./LineLayer";

// export default function lineBackend(Comp) {
//   const wrappedComponentName = Comp.displayName || Comp.name || "Component";

//   class BackendComp extends React.Component<any> {
//     static displayName = `LineBackend(${wrappedComponentName})`;
//     render() {
//       return (
//       );
//     }
//   }

//   return (
//     <DndProvider backend={HTML5Backend as any}>
//       {hoistStatics(BackendComp, Comp)}
//     </DndProvider>
//   );
// }

export class LineBackendProps {}

export const LineBackend: React.FC<LineBackendProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend as any}>
      <div>
        {props.children}
        <LineLayer />
      </div>
    </DndProvider>
  );
};

LineBackend.defaultProps = new LineBackendProps();
