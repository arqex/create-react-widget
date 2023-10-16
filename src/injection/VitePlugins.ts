import { WidgetConfig } from "./types";

// Removes unnecesary parts of the dev index.html file
export const VitePluginWidgetPreHTML = () => ({
  name: 'widget-pre-html',
  transformIndexHtml: {
    enforce: 'pre',
    transform(html: string) {
      return html
        .replace(/<link id="page_styles".*?\/>/, '')
        .replace(/\s+<\/head>/s, '  </head>');
    }
  }
});

// Moves the widget to the body of the index.html file
export const VitePluginWidgetPostHTML = () => ({
  name: 'widget-post-html',
  transformIndexHtml: {
    enforce: 'post',
    transform(html: string) {
      return html
        .replace(/<script[^>]*src="\/widget\.js".*?\/script>/, '')
        .replace(/<body>\s+(.*?)\s+<\/body>/s, '<body>$1\n    <script data-widget crossorigin src="widget.js"></script>\n  </body>');
    }
  }
});

export const VitePluginWidgetInjector = (injectorFileName: string, options: WidgetConfig) => ({
  name: 'widget-injector',
  // @ts-ignore
  transform( src: string, id: string ) {
    if( id.match(/\/injection\/injector.ts$/) ) {
      return `
import {inject} from './${injectorFileName}';
inject(${JSON.stringify(options)});
`
    }
  }
});
