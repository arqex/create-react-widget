export interface ExternalReactConfig {
  react: string;
  reactDOM: string;
}

export interface WidgetConfig {
  externalReact?: ExternalReactConfig;
  buildFilename?: string;
}