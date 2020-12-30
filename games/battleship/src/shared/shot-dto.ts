import { GameState } from 'mule-sdk-js';

import { Shot } from './types';

export function getShotsFromGameState(gameState: GameState, playerRel: string): Shot[] {
  return gameState.playerVariables[playerRel].shots as Shot[];
}
