export type CustomOptions = Record<string, string | number | boolean>;

export interface FeGameConfig {
  id: string;
  colyseus: boolean;
  frontend: string;
  displayName: string;

  // customOptions: {}
  quickOptions?: CustomOptions;
}
