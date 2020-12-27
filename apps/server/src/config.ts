import { Room } from 'colyseus';

export interface GameConfig {
  id: string;
  displayName: string;
  backendModule?: string;
  frontendFiles: string;
}

export interface McwConfig {
  gamesSupported: GameConfig[];
}


export interface BackendGameConfig {
  GameRoom: Room;
}
