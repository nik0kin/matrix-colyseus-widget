import { Coord } from 'utils';

export const MOVE_CHARACTER_REQUEST = 'MOVE_CHARACTER_REQUEST';

export interface MoveCharacterMessage {
  coord: Coord;
}
