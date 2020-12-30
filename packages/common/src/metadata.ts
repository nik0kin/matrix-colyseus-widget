import { CustomOptions } from './config';
import { GameStatus } from './state';

export interface RoomMetadata {
  gameId: string;
  gameStatus: GameStatus;
  name?: string;
  players: Array<{ id: string; name: string; }>;
  customOptions: CustomOptions;
}
