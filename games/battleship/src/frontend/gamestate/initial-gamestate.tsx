
import { GameState } from '../types';

import { getBattleshipGameState } from './mule/data';

export function getInitialGameState(): Promise<GameState> {
  return getBattleshipGameState();
}
