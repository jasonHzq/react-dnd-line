export function getDOMRect(dom: HTMLDivElement) {
  const rect = dom.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    left: rect.left + document.body.scrollLeft,
    top: rect.top + document.body.scrollTop,
  };
}
