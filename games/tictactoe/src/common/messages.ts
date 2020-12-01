import { Coord } from 'utils';

export const PLACE_MARK = 'PLACE_MARK';

export interface PlaceMarkMessage {
  coord: Coord;
}
