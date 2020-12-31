import { Coord } from '../mule-common';

export * from './alignment';
export * from './ship';

export interface Action {
  type: string;
  params: any;
  metadata?: any;
}

export interface Turn {
  turnNumber: number; // use index?
  // metaTurn?: UnknownType[]; // TODO unsure if optional
  playerTurns: {
    [playerRel: string]: {
      actions: Action[];
      dateSubmitted: Date;
    }
  };
}

export interface PlayerVariablesMap {
  [lobbyPlayerId: string]: BattleshipPlayerVariables;
}

export interface BattleshipPlayerVariables {
  hasPlacedShips: boolean;
  shots: Shot[];
}

export interface Square {
  ownerId: string; // playerRel
  coord: Coord;
}

export interface Shot {
  coord: Coord;
  hit: boolean;
}
