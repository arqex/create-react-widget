import {mountWidget} from './mountWidget';
import {setStylesNode} from './stylesUpdater.build';


export async function inject() {
  // @ts-ignore
  const assetsURL = document.currentScript.src.split('/').slice(0, -1).join('/') + '/assets';
  if( !window.React ) {
    window.widgetReactPromise = window.widgetReactPromise || Promise.all([
      loadScript(`${assetsURL}/react.production.min.js`),
      loadScript(`${assetsURL}/react-dom.production.min.js`),
      preload(`${assetsURL}/#placeholder#`),
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
