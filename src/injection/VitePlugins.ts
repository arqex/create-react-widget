import path from "path";
import fs from 'fs';
import { InjectionOptions, WidgetConfig } from "./types";


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
      injectorFileName = options.externalizeURL ? 'injector.build-external.ts' : 'injector.build.ts';
    }

    console.log('ENV', process.env);
    const injectionOptions: InjectionOptions = {
      externalizeURL: options.externalizeURL,
      isBuildTest: process.env.BUILD_TEST === 'true'
    };
    
    if( id.match(/\/injection\/injector.ts$/) ) {
      return `
import {inject} from './${injectorFileName}';
inject(${JSON.stringify(injectionOptions)});
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
      file.code = file.code.replace('#placeholder#', imp[1].split('/').pop());
    }
    console.log('generateBundle', file);
  }
});

export const ViteCopyReact = () => ({
  name: 'widget-copy-react',
  writeBundle(options: any) {
    console.log( 'WRITE OPTIONS', options );
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const DEST_PATH = options.dir;
    const MODULES_PATH = findReactNodeModulesPath(__dirname);

    if( !MODULES_PATH ) {
      throw new Error('React not found to add to the widget bundle. Have you run npm install?');
    }

    fs.copyFileSync(
      path.join(MODULES_PATH, 'react/umd/react.production.min.js'),
      path.join(DEST_PATH, 'assets/react.production.min.js')
    );
    fs.copyFileSync(
      path.join(MODULES_PATH, 'react-dom/umd/react-dom.production.min.js'),
      path.join(DEST_PATH, 'assets/react-dom.production.min.js')
    );
  }
});

function findReactNodeModulesPath(currentDir: string): string | undefined {
  while (currentDir !== path.resolve(currentDir, '..') ) {
    const nodeModulesPath = path.join(currentDir, 'node_modules');
    if( fs.existsSync(path.join(nodeModulesPath, 'react')) ) {
      return nodeModulesPath;
    }
    currentDir = path.resolve(currentDir, '..');
  }
}