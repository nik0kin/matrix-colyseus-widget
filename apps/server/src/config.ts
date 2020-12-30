import { Room } from 'colyseus';

import { CustomOptions } from 'common';

export interface GameConfig {
  id: string;
  displayName: string;
  backendModule?: string;

  // One or the other
  frontendFiles?: string;
  frontendIframe?: string;

  quickOptions?: CustomOptions;

  attribution?: {
    author: string;
    license: string;
    source: string;
  };
}

export interface McwConfig {
  gamesSupported: GameConfig[];
}


// TODO-easy move this to common package
export interface BackendGameConfig {
  GameRoom: Room;
  customOptions?: Record<string, {
    min: number;
    max: number;
  }>;
}
