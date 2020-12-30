
import * as constants from '../../constants';
import { GameState } from '../../types';

export interface LoadMuleState {
  type: constants.LOAD_MULE_STATE;
}

export function loadMuleState(): LoadMuleState {
  return {
    type: constants.LOAD_MULE_STATE,
  };
}

export interface LoadMuleStateSuccess {
  type: constants.LOAD_MULE_STATE_SUCCESS;
  gameState: GameState;
}

export function loadMuleStateSuccess(gameState: GameState): LoadMuleStateSuccess {
  return {
    type: constants.LOAD_MULE_STATE_SUCCESS,
    gameState,
  };
}

export interface LoadMuleStateFailure {
  type: constants.LOAD_MULE_STATE_FAILURE;
  error: Error;
}

export function loadMuleStateFailure(error: Error): LoadMuleStateFailure {
  return {
    type: constants.LOAD_MULE_STATE_FAILURE,
    error,
  };
}
