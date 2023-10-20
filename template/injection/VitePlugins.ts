import { WidgetConfig } from "./types";
// import fs from 'fs';

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

export const VitePluginWidgetInjector = (isProductionBuild: boolean, options: WidgetConfig) => ({
  name: 'widget-injector',
  // @ts-ignore
  transform( src: string, id: string ) {
    let injectorFileName = 'injector.dev.ts';
    if( isProductionBuild ) {
      injectorFileName = options.externalReact ? 'injector.build-external.ts' : 'injector.build.ts';
    }
    
    if( id.match(/\/injection\/injector.ts$/) ) {
      return `
import {inject} from './${injectorFileName}';
inject(${JSON.stringify(options)});
`
    }
  }
});

export const VitePreloadReplacer = () => ({
  name: 'widget-preload-replacer',
  // @ts-ignore
  generateBundle(options: any, files: any) {
    const fileName = options.entryFileNames;
    const file = files[fileName];

    const imp = file.code.match(/import\("(.*?)"/);
    if( imp ){
      file.code = file.code.replace('#placeholder#', imp[1]);
    }
    console.log('generateBundle', file);
  }
});
