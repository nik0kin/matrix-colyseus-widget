import * as _ from 'lodash';

import { Alignment, PlayerVariablesMap, Ship } from '../';
import { Coord } from '../mule-common';
import { getIdFromShip, findOneShip } from '../ship';
import { GameState } from '../state';

export const PLACE_SHIPS_MULE_ACTION: string = 'PlaceShips';

export interface PlaceShipsMuleActionParams {
  shipPlacements: ShipPlacement[];
}

interface Action {
  type: typeof PLACE_SHIPS_MULE_ACTION;
  params: PlaceShipsMuleActionParams;
}

export interface ShipPlacement {
  shipId: number;
  coord: Coord;
  alignment: Alignment;
}

export function getPlaceShipsMuleActionFromParams(params: PlaceShipsMuleActionParams) {
  return {
    type: PLACE_SHIPS_MULE_ACTION,
    params,
  };
}

export function getPlaceShipsActionParamsFromMuleAction(action?: Action): PlaceShipsMuleActionParams {
  return {
    shipPlacements: (action && action.params.shipPlacements as ShipPlacement[]) || []
  };
}

export function getPlaceShipsActionWithNewShipPlacement(existingAction: Action | undefined, newShipPlacement: ShipPlacement): Action {
  const existingShipPlacements: ShipPlacement[] = getPlaceShipsActionParamsFromMuleAction(existingAction).shipPlacements;

  const newParams: PlaceShipsMuleActionParams = {
    shipPlacements: _.uniqBy(
      [
        newShipPlacement,
        ...existingShipPlacements,
      ],
      (shipPlacement: ShipPlacement) => shipPlacement.shipId,
    )
  };

  return getPlaceShipsMuleActionFromParams(newParams);
}

export function isPlaceShipsAction(action: Action): boolean {
  return action.type === 'PlaceShips';
}

export function getPlaceShipsParamsFromAction(action: Action | undefined): PlaceShipsMuleActionParams {
  if (!action) {
    return {
      shipPlacements: [],
    };
  }
  return action.params;
}

export function doesShipIdExistInShipPlacements(shipPlacements: ShipPlacement[], shipId: number): boolean {
  return _.some(shipPlacements, (shipPlacement: ShipPlacement): boolean => {
    return shipPlacement.shipId === shipId;
  });
}

export function isPlacementMode(gameState: GameState, lobbyPlayerId: string): boolean {
  return !gameState.playerVariables.get(lobbyPlayerId).hasPlacedShips;
}

export function getAllShipsIncludingPendingActions(lobbyPlayerId: string, playersShips: Ship[], pendingActions: Action[]): Ship[] {

  return _.uniqBy(
    _.concat(
      getShipsFromPendingActions(lobbyPlayerId, playersShips, pendingActions), // add ships from pending PlaceShips Action
      playersShips,
    ),
    getIdFromShip,
  );
}

export function getShipsFromPendingActions(lobbyPlayerId: string, playersShips: Ship[], pendingActions: Action[]): Ship[] {
  return _.reduce(
    _.filter(pendingActions, isPlaceShipsAction),
    (ships: Ship[], action: Action): Ship[] => {
      _.each(getPlaceShipsParamsFromAction(action).shipPlacements, (shipPlacement: ShipPlacement) => {

        // TODO is this a flatmap?

        const ship: Ship = findOneShip(playersShips, shipPlacement.shipId);
        const pendingShip: Ship = getPendingShipFromShipPlacement(ship, shipPlacement);

        ships.push(pendingShip);
      });

      return ships;
    },
    [],
  );
}

export function getPendingShipFromShipPlacement(ship: Ship, shipPlacement: ShipPlacement): Ship {
  if (ship.id !== shipPlacement.shipId) throw new Error('bad shipids in getPendingShipFromShipPlacement()');

  return _.assign(
    {},
    ship,
    {
      coord: shipPlacement.coord,
      alignment: shipPlacement.alignment,
    }
  );
}


export function isShipPlaced(shipId: number, pendingActions: Action[]): boolean {
  return _.some(
    _.filter(pendingActions, isPlaceShipsAction),
    (action: Action) => {
      return _.some(getPlaceShipsParamsFromAction(action).shipPlacements, (shipPlacement: ShipPlacement) => {
        return shipPlacement.shipId === shipId;
      });
    }
  );
}
