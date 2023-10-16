// Replaces the script tag by the widget
function replaceMarkup() {
  const toBeReplaced = document.querySelector('[data-widget]');
  const root = document.createElement('div');
  root.id = 'root';
  toBeReplaced?.replaceWith(root);
  const shadow = root.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<div id="widget"></div><div id="styles">`;
  
  const widget = shadow.getElementById('widget') as HTMLElement;
  const styles = shadow.getElementById('styles');

  return { widget, styles };
}

export function mountWidget() {
  return replaceMarkup();
}