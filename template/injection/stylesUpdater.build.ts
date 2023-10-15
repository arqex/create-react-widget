export function setStylesNode(styleTag: HTMLElement | null) {
  // `setWidgetStyles` has been set by 
  // `vite-plugin-css-injected-by-js` in vite.config
  // @ts-ignore 
  window.setWidgetStyles(styleTag);
}