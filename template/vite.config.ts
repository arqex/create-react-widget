import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import widgetConfig from './widget.config'
import { VitePluginWidgetPreHTML, VitePluginWidgetPostHTML, VitePluginWidgetInjector, VitePreloadReplacer } from './injection/VitePlugins'

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig( ({command}) => {
  return command === 'build' ? getProductionConfig() : getDevConfig()
});

function getProductionConfig() {
  return {
    plugins: [
      react(),
      VitePluginWidgetInjector(true, widgetConfig),
      widgetConfig.externalReact && viteExternalsPlugin({
        react: 'React',
        'react-dom': 'ReactDOM',
      }),
      cssInjectedByJsPlugin({
        injectCodeFunction: (cssCode) => {
          window.setWidgetStyles = (node: HTMLElement) => {
            var styleTag = document.createElement('style');
            styleTag.innerHTML = cssCode;
            node.appendChild(styleTag);
          }
        }
      }),
      VitePluginWidgetPreHTML(),
      VitePluginWidgetPostHTML(),
      VitePreloadReplacer(),
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
      VitePluginWidgetInjector(false, widgetConfig),
    ]
  }
}