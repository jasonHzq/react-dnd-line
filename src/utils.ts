import * as React from "react";

export function getDOMRect(dom: HTMLDivElement) {
  const rect = dom.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    left: rect.left + document.body.scrollLeft,
    top: rect.top + document.body.scrollTop,
  };
}

export const ContainerContext = React.createContext({
  left: 0,
  top: 0,
});

export const BORDER_WIDTH = 1;
