import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import widgetConfig from './widget.config'
import { VitePluginWidgetPreHTML, VitePluginWidgetPostHTML, VitePluginWidgetInjector } from './injection/VitePlugins'

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig( ({command}) => {
  return command === 'build' ? getProductionConfig() : getDevConfig()
});

function getProductionConfig() {
  return {
    plugins: [
      react(),
      VitePluginWidgetInjector('injector.build.ts', widgetConfig),
      widgetConfig.externalReact && viteExternalsPlugin({
        react: 'React',
        'react-dom': 'ReactDOM',
      }),
      cssInjectedByJsPlugin({
        injectCodeFunction: (cssCode) => {
          // @ts-ignore stylesUpdater 
          window.setWidgetStyles = (node: HTMLElement) => {
            var styleTag = document.createElement('style');
            styleTag.innerHTML = cssCode;
            node.appendChild(styleTag);
          }
        }
      }),
      VitePluginWidgetPreHTML(),
      VitePluginWidgetPostHTML()
    ],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `${widgetConfig.buildFilename || 'widget' }.js`,
        }
      }
    }
  }
}

function getDevConfig() {
  return {
    plugins: [
      react(),
      VitePluginWidgetInjector('injector.dev.ts', widgetConfig),
    ]
  }
}