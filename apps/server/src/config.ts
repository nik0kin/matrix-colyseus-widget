import { Room } from 'colyseus';

export interface GameConfig {
  id: string;
  backendModule?: string;
  frontendFiles: string;
}

export interface McwConfig {
  gamesSupported: GameConfig[];
}


export interface BackendGameConfig {
  name: string;
  GameRoom: Room;
}
