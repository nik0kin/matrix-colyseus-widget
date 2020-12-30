import { every, reduce } from 'lodash';

import { Action, VariableMap } from 'mule-sdk-js';

import {
  areCoordsEqual, Coord, getCoordString, getShipStructureCoords,
  Ship, Shot,
} from '../';

export const FIRE_SHOT_MULE_ACTION: string = 'FireShot';

export interface FireShotMuleActionParams {
  shotCoord: Coord;
}

export function getFireShotMuleActionFromParams(params: FireShotMuleActionParams): Action {
  return {
    type: FIRE_SHOT_MULE_ACTION,
    params: params as any as VariableMap,
  } as Action;
}

export interface FireShotMuleActionMetaData {
  newShot: Shot;
  sunkShip: Ship | undefined;
}

export function getFireShotActionMetaData(action: Action | undefined): FireShotMuleActionMetaData | undefined {
  if (!action || action.type !== FIRE_SHOT_MULE_ACTION) return;

  return action.metadata as any as FireShotMuleActionMetaData;
}

export function isShipSunk(ship: Ship, shots: Shot[]): boolean {
  const shotHitsByCoord: {[stringCoord: string]: boolean} = reduce(
    shots,
    (prev: {[stringCoord: string]: boolean}, shot: Shot) => {
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
