import { Coord } from 'utils';

export const MOVE_CHARACTER_REQUEST = 'MOVE_CHARACTER_REQUEST';

export interface MoveCharacterMessage {
  coord: Coord;
}

export const DO_ACTION_REQUEST = 'DO_ACTION_REQUEST';

export interface DoActionMessage { // rename to QueueAction?
  coord: Coord;
  tool: string;
}
