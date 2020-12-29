
export interface FeGameConfig {
  id: string;
  colyseus: boolean;
  frontend: string;
  displayName: string;

  // customSettings: {}
  quickSettings: Record<string, string | number | boolean>;
}
