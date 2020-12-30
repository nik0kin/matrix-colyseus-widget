import { Action } from 'mule-sdk-js';

import * as constants from '../constants';
import { Coord } from '../../shared';

export * from './mule';

// UI

export interface ClickSquare {
  type: constants.CLICK_SQUARE;
  lobbyPlayerId: string; // which grid? (p1 or p2)
  x: number;
  y: number;
}

export function clickSquare(lobbyPlayerId: string, coord: Coord): ClickSquare {
  return {
    type: constants.CLICK_SQUARE,
    lobbyPlayerId,
    x: coord.x,
    y: coord.y,
  };
}

export interface ClickSubmit {
  type: constants.CLICK_SUBMIT;
  pendingTurn: {actions: Action[]};
}

export function clickSubmit(pendingTurn: {actions: Action[]}): ClickSubmit {
  return {
    type: constants.CLICK_SUBMIT,
    pendingTurn,
  };
}

export interface SelectShipListShip {
  type: constants.SELECT_SHIPLIST_SHIP;
  shipId: number;
}

export function selectShipListShip(shipId: number): SelectShipListShip {
  return {
    type: constants.SELECT_SHIPLIST_SHIP,
    shipId,
  };
}

// Mule Actions

export interface RemovePendingAction {
  type: constants.REMOVE_PENDING_ACTION;
  index: number;
}

export function removePendingAction(index: number): RemovePendingAction {
  return {
    type: constants.REMOVE_PENDING_ACTION,
    index,
  };
}


