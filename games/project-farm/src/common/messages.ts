import { Coord } from 'utils';

export const MOVE_CHARACTER = 'MOVE_CHARACTER';

export interface MoveCharacterMessage {
  coord: Coord;
}
