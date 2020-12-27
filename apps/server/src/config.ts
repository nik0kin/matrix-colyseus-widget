import { Room } from 'colyseus';

export interface GameConfig {
  id: string;
  displayName: string;
  backendModule?: string;

  // One or the other
  frontendFiles?: string;
  frontendIframe?: string;
}

export interface McwConfig {
  gamesSupported: GameConfig[];
}


export interface BackendGameConfig {
  GameRoom: Room;
}
