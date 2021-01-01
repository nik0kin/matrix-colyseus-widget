export type CustomOptions = Record<string, string | number | boolean>;

export interface FeGameConfig {
  id: string;
  displayName: string;

  colyseus: boolean;
  joinableInProgress?: boolean;

  frontend: string;

  customOptions?: Record<string, {
    min: number;
    max: number;
  }>;
  quickOptions?: CustomOptions;

  attribution?: {
    author: string;
    license: string;
    source: string;
  };
}
