
import * as _ from 'lodash';

import {
  getAlignmentOffset, getShipStructure,
  Ship, ShipStructure,
} from './types';
import {
  getPendingShipFromShipPlacement, findOneShip, isValidCoord, ShipPlacement,
} from './';
import { addCoords, areCoordsEqual, Coord } from './mule-common';


export function getShipPlacementCollisions(lobbyPlayerId: string, playerShips: Ship[], shipPlacements: ShipPlacement[]): ShipPlacement[] {
  return _.filter(shipPlacements, (shipPlacement1: ShipPlacement) => {
    return _.some(shipPlacements, (shipPlacement2: ShipPlacement) => {
      return isShipOnShip(
        getPendingShipFromShipsAndShipPlacement(lobbyPlayerId, playerShips, shipPlacement1),
        getPendingShipFromShipsAndShipPlacement(lobbyPlayerId, playerShips, shipPlacement2),
      );
    });
  });
}

function isShipOnShip(ship1: Ship, ship2: Ship): boolean {
  if (ship1.id === ship2.id) return false;

  const ship1Structure: ShipStructure = getShipStructure(ship1.shipType);
  const ship2Structure: ShipStructure = getShipStructure(ship2.shipType);

  // TODO see if theres any dup logic w/ isShipOnSquare
  return _.some(ship1Structure.squares, (offset1: Coord) => {
    return _.some(ship2Structure.squares, (offset2: Coord) => {
      const coord1: Coord = addCoords(ship1.coord, getAlignmentOffset(offset1, ship1.alignment));
      const coord2: Coord = addCoords(ship2.coord, getAlignmentOffset(offset2, ship2.alignment));
      return areCoordsEqual(coord1, coord2);
    });
  });
}

function getPendingShipFromShipsAndShipPlacement(lobbyPlayerId: string, playerShips: Ship[], shipPlacement: ShipPlacement): Ship {
  const ship: Ship = findOneShip(playerShips, shipPlacement.shipId);
  return getPendingShipFromShipPlacement(ship, shipPlacement);
}

export function getInvalidShipPlacements(lobbyPlayerId: string, gridSize: Coord, playerShips: Ship[], shipPlacements: ShipPlacement[]) {
  return _.concat(
    getShipPlacementCollisions(lobbyPlayerId, playerShips, shipPlacements),
    getOutOfBoundsShipPlacements(gridSize, playerShips, shipPlacements),
  );
}

export function getOutOfBoundsShipPlacements(gridSize: Coord, playerShips: Ship[], shipPlacements: ShipPlacement[]) {
  return _.filter(shipPlacements, (shipPlacement: ShipPlacement) => {
    const ship: Ship = findOneShip(playerShips, shipPlacement.shipId);
    const shipStructure: ShipStructure = getShipStructure(ship.shipType);
    return _.some(shipStructure.squares, (offset1: Coord) => {
      const coord = addCoords(shipPlacement.coord, getAlignmentOffset(offset1, shipPlacement.alignment));
      return !isValidCoord(coord, gridSize);
    });
  });
}
