import { WidgetConfig } from './types';
import {mountWidget} from './mountWidget';
import {setStylesNode} from './stylesUpdater.dev';
import {render} from "../src/main";

export function inject(config: WidgetConfig) {
  console.log('Injecting with config', config);
  const {styles, widget} = mountWidget();
  setStylesNode(styles);
  render(widget);
}