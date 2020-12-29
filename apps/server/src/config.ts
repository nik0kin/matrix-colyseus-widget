import { Room } from 'colyseus';

import { CustomOptions } from 'common';

export interface GameConfig {
  id: string;
  displayName: string;
  backendModule?: string;

  // One or the other
  frontendFiles?: string;
  frontendIframe?: string;

  quickOptions: CustomOptions;
}

export interface McwConfig {
  gamesSupported: GameConfig[];
}


export interface BackendGameConfig {
  GameRoom: Room;
}
