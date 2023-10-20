import { WidgetConfig } from './types';
import {mountWidget} from './mountWidget';
import {setStylesNode} from './stylesUpdater.build';
import {render} from "../src/main";


export function inject(config: WidgetConfig) {
  console.log('Injecting with config', config);
  const {styles, widget} = mountWidget();
  setStylesNode(styles);
  render(widget);
}



/*

(function dependencyLoader() {
  Promise.all([
    loadScript('https://unpkg.com/react@18.2.0/umd/react.production.min.js'),
    loadScript('https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'),
  ]).then(() => import('../src/main.js'));
}());

function loadScript( src: string ): Promise<void> {
  var s = document.createElement('script');
  s.setAttribute('src', src);
  s.setAttribute('crossorigin', 'anonymous');
  return new Promise<void>( resolve => {
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}


*/