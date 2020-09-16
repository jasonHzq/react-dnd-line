import * as React from "react";
import { createContainer } from "unstated-next";

export function getDOMRect(dom: HTMLDivElement) {
  if (!dom) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };
  }
  const rect = dom.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    left: rect.left,
    top: rect.top,
  };
}

export function getDiffRect(point: Rect, dom: Rect) {
  return {
    left: point.left - dom.left + point.width / 2,
    top: point.top - dom.top + point.height / 2,
    width: point.width,
    height: point.height,
  };
}

export class Rect {
  width: number;
  height: number;
  left: number;
  top: number;
  value?: string;
}

export function getPosition(value: string, points: Rect[]) {
  const foundPoint = points.find((point) => point.value === value);

  if (!foundPoint) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  return {
    x: foundPoint.left,
    y: foundPoint.top,
    width: foundPoint.width,
    height: foundPoint.height,
  };
}

export const getLines = ([begin, end]: [string, string], points: Rect[]) => {
  return {
    begin: getPosition(begin, points),
    end: getPosition(end, points),
  };
};

export const BORDER_WIDTH = 1;
