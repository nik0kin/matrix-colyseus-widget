import { ArraySchema } from '@colyseus/schema';
import { find } from 'lodash';

import { Shot } from './types';
import { Coord } from './mule-common';
import { ShotSchema } from './state';

export function getShotOnSquare(coord: Coord, shots: Array<Shot> | ArraySchema<ShotSchema>): Shot | undefined {
  return find(shots, (shot: Shot) => {
    return shot.coord.x === coord.x && shot.coord.y === coord.y;
  });
}
