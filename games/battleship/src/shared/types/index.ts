import { MuleStateSdk } from 'mule-sdk-js';

import { Coord } from '../mule-common';

export * from './alignment';
export * from './ship';

export interface PlayerVariablesMap {
  [lobbyPlayerId: string]: BattleshipPlayerVariables;
}

export interface BattleshipPlayerVariables {
  hasPlacedShips: boolean;
  shots: Shot[];
}

export function setPlayerVariable(M: MuleStateSdk, lobbyPlayerId: string, key: keyof BattleshipPlayerVariables, value: any) {
  return M.setPlayerVariable(lobbyPlayerId, key, value);
}

export interface Square {
  ownerId: string; // playerRel
  coord: Coord;
}

export interface Shot {
  coord: Coord;
  hit: boolean;
}
