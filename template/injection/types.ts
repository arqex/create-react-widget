
declare global {
  interface Window {
    widgetReactPromise: Promise<any> | undefined;
    setWidgetStyles: (node: HTMLElement) => void;
  }
}

export interface ExternalReactConfig {
  react: string;
  reactDOM: string;
}

export interface WidgetConfig {
  externalReact?: ExternalReactConfig;
  buildFilename?: string;
}
