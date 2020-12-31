import * as _ from 'lodash';

import { Alignment } from './types/alignment';
import { DEFAULT_GAME_START_SHIP_SETUP_COUNTS, getShipStructure, Ship, ShipStructure, ShipType } from './types/ship';
import { Coord, isValidCoord } from './mule-common';

export function getIdFromShip(ship: Ship): number {
  return ship.id;
}

export function getTotalShipsPerPlayer(): number {
  return _.reduce(
    DEFAULT_GAME_START_SHIP_SETUP_COUNTS, // TODO dont hardcode
    (total: number, count: number, shipType) => {
      return total + count;
    },
    0
  );
}

// playerShips must contain ship
export function findOneShip(playerShips: Ship[], shipId: number): Ship {
  const ship = _.find(playerShips, (_ship: Ship) => _ship.id === shipId) as Ship;
  if (!ship) {
    throw 'playerShips should contain shipId ' + playerShips.toString();
  } else {
    return ship;
  }
}

export function isAnyShipOnSquare(gridSize: Coord, coord: Coord, ships: Ship[]): boolean {
  if (!isValidCoord(coord, gridSize)) {
    return false;
  }

  return _.some(ships, (ship: Ship) => {
    return isShipOnSquare(coord, ship);
  });
}

export function getShipOnSquare(gridSize: Coord, coord: Coord, ships: Ship[]): Ship | undefined {
  if (!isValidCoord(coord, gridSize)) {
    return undefined;
  }

  return _.find(ships, (ship: Ship) => {
    return isShipOnSquare(coord, ship);
  });
}

export function isShipOnSquare(coord: Coord, ship: Ship): boolean {
  const shipStructure: ShipStructure = getShipStructure(ship.shipType);

  if (!shipStructure) throw new Error('invalid ShipType: ' + ship.shipType);

  return _.some(shipStructure.squares, (strucutureCoord: Coord) => {
    let structureX: number;
    let structureY: number;

    // horizontal
    if (ship.alignment === Alignment.Horizontal) {
      structureX = ship.coord.x + strucutureCoord.x;
      structureY = ship.coord.y + strucutureCoord.y;
    } else { // vertical
      structureX = ship.coord.x + strucutureCoord.y;
      structureY = ship.coord.y + strucutureCoord.x;
    }

    return coord.x === structureX && coord.y === structureY;
  });
}
