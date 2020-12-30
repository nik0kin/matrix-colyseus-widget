import { find } from 'lodash';

import { Shot } from './types';
import { Coord } from './mule-common';

export function getShotOnSquare(coord: Coord, shots: Shot[]): Shot | undefined {
  return find(shots, (shot: Shot) => {
    return shot.coord.x === coord.x && shot.coord.y === coord.y;
  });
}
