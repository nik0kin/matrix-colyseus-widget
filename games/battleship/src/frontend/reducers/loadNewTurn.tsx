import { Action } from 'mule-sdk-js';

import {
  FireShotMuleActionMetaData, getAllShipsIncludingPendingActions,
  PLACE_SHIPS_MULE_ACTION, Ship,
} from '../../shared';

import { StoreState } from '../types';
import { LoadNewTurn } from '../actions';

export function loadNewTurnReducer(state: StoreState, loadNewTurn: LoadNewTurn): StoreState {
  const newMuleState = {
    ...state.gameState.mule,
    isYourTurn: !state.gameState.mule.isYourTurn,
    currentTurn: loadNewTurn.newTurn.turnNumber + 1,
    previousTurns: [...state.gameState.mule.previousTurns, loadNewTurn.newTurn],
  };

  const whosTurn: string = state.gameState.mule.isYourTurn ? state.gameState.yourLobbyPlayerId : state.gameState.theirLobbyPlayerId;
  const action: Action = loadNewTurn.newTurn.playerTurns[whosTurn].actions[0];

  // Process your Completed Turn
  if (whosTurn === state.gameState.yourLobbyPlayerId) {
    const emptyTurn: { actions: Action[] } = {
      actions: []
    };

    if (action.type === PLACE_SHIPS_MULE_ACTION) {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          mule: newMuleState,
          isPlacementMode: false,
          yourShips: getAllShipsIncludingPendingActions(whosTurn, state.gameState.yourShips, [action]),
        },
        pendingTurn: emptyTurn,
        ui: getNoSelectedCoordUiState(state.ui),
        isSubmitting: false,
      };
    } else { // FIRE SHOT
      const fireShotMetadata: FireShotMuleActionMetaData = (action.metadata as any);
      const sunkShip: Ship | undefined = fireShotMetadata.sunkShip;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          mule: newMuleState,
          yourShots: [...state.gameState.yourShots, fireShotMetadata.newShot],
          theirShips: sunkShip ? [...state.gameState.theirShips, sunkShip] : state.gameState.theirShips,
        },
        pendingTurn: emptyTurn,
        ui: getNoSelectedCoordUiState(state.ui),
        isSubmitting: false,
      };
    }
  }

  // Process their Completed Turn
  if (action.type === PLACE_SHIPS_MULE_ACTION) {
      return {
        ...state,
        gameState: {
          ...state.gameState,
          mule: newMuleState,
          isOpponentPlacementMode: false,
          // theirShips.. dont update theirShips, that should be hidden knowledge
        },
        ui: getNoSelectedCoordUiState(state.ui),
        isSubmitting: false,
      };
  } else { // FIRE SHOT
    const fireShotMetadata: FireShotMuleActionMetaData = (action.metadata as any);
    return {
      ...state,
      gameState: {
        ...state.gameState,
        mule: newMuleState,
        theirShots: [...state.gameState.theirShots, fireShotMetadata.newShot], 
      },
      ui: getNoSelectedCoordUiState(state.ui),
      isSubmitting: false,
    };
  }
}

function getNoSelectedCoordUiState(ui: any) {
  return {
    ...ui,
    selectedCoord: undefined,
  };
}
