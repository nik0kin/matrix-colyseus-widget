import { ArraySchema } from '@colyseus/schema';
import { every } from 'lodash';

import {
  areCoordsEqual, Coord, getCoordString, getShipStructureCoords,
  Ship, Shot,
} from '../';
import { ShotSchema } from '../state';

export const FIRE_SHOT_MULE_ACTION: string = 'FireShot';

export interface FireShotMuleActionParams {
  shotCoord: Coord;
}

export function getFireShotMuleActionFromParams(params: FireShotMuleActionParams) {
  return {
    type: FIRE_SHOT_MULE_ACTION,
    params,
  };
}

export interface FireShotMuleActionMetaData {
  newShot: Shot;
  sunkShip: Ship | undefined;
}

export function isShipSunk(ship: Ship, shots: Shot[] | ArraySchema<ShotSchema>): boolean {
  const shotHitsByCoord: { [stringCoord: string]: boolean } = (shots.reduce as any)(
    (prev: { [stringCoord: string]: boolean }, shot: Shot) => {
      prev[getCoordString(shot.coord)] = true;
      return prev;
    },
    {},
  );
  return every(
    getShipStructureCoords(ship),
    (coord: Coord) => shotHitsByCoord[getCoordString(coord)],
  );
}

export function isValidFireShotCoord(coord: Coord | undefined, previousShots: Shot[]): boolean {
  if (!coord) return false;

  return every(previousShots, (shot: Shot) => {
    return !areCoordsEqual(coord, shot.coord);
  });
}
