import { WidgetConfig } from './types';
import {mountWidget} from './mountWidget';
import {setStylesNode} from './stylesUpdater.build';


export async function inject(config: WidgetConfig) {
  console.log('Injecting with config', config);

  if( !window.React ) {
    window.widgetReactPromise = window.widgetReactPromise || Promise.all([
      loadScript(config.externalReact?.react ?? 'https://unpkg.com/react/umd/react.production.min.js'),
      loadScript(config.externalReact?.reactDOM ?? 'https://unpkg.com/react-dom/umd/react-dom.production.min.js'),
      preload("#placeholder#")
    ]);
    await window.widgetReactPromise;
  }
  const {render} = await import('../src/main');
  const {styles, widget} = mountWidget();
  setStylesNode(styles);
  render(widget);
}

function loadScript( src: string ): Promise<void> {
  var s = document.createElement('script');
  setAttributes(s, {
    type: 'text/javascript',
    src: src
  });
  return new Promise<void>( resolve => {
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

function preload( src: string): Promise<void> {
  var l = document.createElement('link');
  setAttributes(l, {
    rel: 'preload',
    href: src,
    as: 'script',
    crossorigin: 'anonymous'
  });
  return new Promise<void>( resolve => {
    l.onload = () => setTimeout( resolve );
    document.head.appendChild(l);
  });
}

function setAttributes(el: HTMLElement, attrs: {[key: string]: string}) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
