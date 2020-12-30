import { call, put, takeEvery } from 'redux-saga/effects';

import { LoadMuleState, loadMuleStateSuccess, loadMuleStateFailure } from '../actions';
import * as constants from '../constants';
import { getInitialGameState } from '../gamestate/initial-gamestate';
import { GameState } from '../types';

// worker Saga: will be fired on LOAD_MULE_STATE actions
function* loadMuleState(action: LoadMuleState) {
   try {
      const gameState: GameState = yield call(getInitialGameState);
      yield put(loadMuleStateSuccess(gameState));
   } catch (e) {
      yield put(loadMuleStateFailure(e));
   }
}

/*
  Starts loadMuleState on each dispatched `LOAD_MULE_STATE` action.
  Allows concurrent fetches of GameState (but will only ever be fired once).
*/
export function* loadMuleStateSaga() {
  yield takeEvery(constants.LOAD_MULE_STATE, loadMuleState);
}
