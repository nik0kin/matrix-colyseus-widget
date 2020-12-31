import * as _ from 'lodash';

import {
  Alignment, Coord, FireShotMuleActionParams, getFireShotMuleActionFromParams,
  getShipsFromPendingActions, getShipOnSquare, getPlaceShipsActionParamsFromMuleAction,
  getPlaceShipsActionWithNewShipPlacement, getPlaceShipsMuleActionFromParams, getRotatedAlignment,
  isValidFireShotCoord, Action,
  PlaceShipsMuleActionParams, Ship, ShipPlacement,
} from '../../shared';

import {
  ClickSquare,
  //  RemovePendingAction,
} from '../actions';
import { StoreState } from '../types';

export function clickSquareReducer(state: StoreState, clickSquareAction: ClickSquare): StoreState {
  const coord: Coord = {
    x: clickSquareAction.x,
    y: clickSquareAction.y,
  };

  // ignore click if submitting
  if (state.isSubmitting) return state;

  if (
    state.gameState.isPlacementMode && state.ui.selectedShipBeingPlaced
    && clickSquareAction.lobbyPlayerId === state.gameState.yourLobbyPlayerId
  ) {

    const newShipPlacement: ShipPlacement = {
      shipId: state.ui.selectedShipBeingPlaced,
      coord,
      alignment: Alignment.Horizontal,
    };

    return {
      ...state,
      ui: {
        ...state.ui,
        selectedShipBeingPlaced: undefined,
      },
      pendingTurn: {
        actions: [
          getPlaceShipsActionWithNewShipPlacement(state.pendingTurn.actions[0], newShipPlacement) // actions[0] will be undefined or a PlaceShips action
        ]
      }
    };
  }

  // if not being placed, but is clicked (rotate)
  if (
    state.gameState.isPlacementMode && !state.ui.selectedShipBeingPlaced
    && clickSquareAction.lobbyPlayerId === state.gameState.yourLobbyPlayerId
  ) {

    const shipOnClickedSquare: Ship | undefined = getShipOnSquare(
      { x: state.gameState.width, y: state.gameState.height },
      coord,
      getShipsFromPendingActions(state.gameState.yourLobbyPlayerId, state.gameState.yourShips, state.pendingTurn.actions)
    );

    if (shipOnClickedSquare) {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedShipBeingPlaced: undefined,
        },
        pendingTurn: {
          actions: [
            getPlaceShipsActionWithRotation(state.pendingTurn.actions[0], shipOnClickedSquare.id) // actions[0] will be undefined or a PlaceShips action
          ]
        }
      };
    }
  }

  if (clickSquareAction.lobbyPlayerId === state.gameState.theirLobbyPlayerId) {
    const pendingTurn: { actions: Action[] } = { actions: [] };

    if (!state.gameState.isPlacementMode && state.gameState.mule.isYourTurn && isValidFireShotCoord(coord, state.gameState.yourShots)) {
      // add pending FireShot Action
      const action: FireShotMuleActionParams = {
        shotCoord: coord,
      };
      pendingTurn.actions.push(getFireShotMuleActionFromParams(action));
    }

    return {
      ...state,
      ui: {
        ...state.ui,
        selectedCoord: coord, // select square
      },
      pendingTurn
    };
  }


  return state;
}

function getPlaceShipsActionWithRotation(pendingPlacementAction: Action, shipId: number): Action {
  const placeShipsActionParams: PlaceShipsMuleActionParams = getPlaceShipsActionParamsFromMuleAction(pendingPlacementAction);

  const newParams: PlaceShipsMuleActionParams = {
    shipPlacements: _.map(placeShipsActionParams.shipPlacements, (shipPlacement: ShipPlacement) => {
      if (shipPlacement.shipId === shipId) {
        return {
          shipId,
          coord: shipPlacement.coord,
          alignment: getRotatedAlignment(shipPlacement.alignment)
        };
      } else {
        return shipPlacement;
      }
    })
  };

  return getPlaceShipsMuleActionFromParams(newParams);
}
