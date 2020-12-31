// import { call, put, takeEvery } from 'redux-saga/effects';
// // import { MulePlayTurnResponse } from 'mule-sdk-js';

// import { ClickSubmit, submitTurnSuccess, submitTurnFailure } from '../actions';
// import * as constants from '../constants';
// import { submitMuleTurn } from '../gamestate/mule';

// // worker Saga: will be fired on CLICK_SUBMIT actions
// function* submitTurn(action: ClickSubmit) {
//    try {
//       const playTurnResponse: MulePlayTurnResponse = yield call(submitMuleTurn, action.pendingTurn.actions);
//       yield put(submitTurnSuccess(playTurnResponse));
//    } catch (e) {
//       yield put(submitTurnFailure(e));
//    }
// }

// /*
//   Starts submitTurn on each dispatched `CLICK_SUBMIT` action.
// */
// export function* submitTurnSaga() {
//    yield takeEvery(constants.CLICK_SUBMIT, submitTurn);
// }
