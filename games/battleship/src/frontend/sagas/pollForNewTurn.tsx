// import { delay } from 'redux-saga';
// import { all, call, fork, put, take } from 'redux-saga/effects';

// import { loadNewTurn, LoadMuleStateSuccess, setWinner } from '../actions';
// import * as constants from '../constants';
// import { checkForNewTurnAndWinner, getNewTurn, NewTurnAndWinner } from '../gamestate/mule';

// const POLL_INTERVAL = 5;

// let isPolling: boolean = false;
// let isGameOver: boolean = false;

// let currentTurn: number = -1;

// // TODO dont poll if game over or if its not your turn

// // Worker Saga, Fired every x seconds
// function* pollForNewTurn() {
//   if (isPolling || currentTurn <= 0 || isGameOver) {
//     return;
//   }

//   isPolling = true;

//   const newTurnAndWinner: NewTurnAndWinner = yield checkForNewTurnAndWinner(currentTurn);
//   if (!newTurnAndWinner.newTurnExists) {
//     console.log('no new turn');
//     isPolling = false;
//     return;
//   }

//   const newTurn: Turn = yield getNewTurn(currentTurn);
//   yield put(loadNewTurn(newTurn)); // (put means dispatch)

//   if (!isGameOver && newTurnAndWinner.winner) {
//     isGameOver = true;
//     yield put(setWinner(newTurnAndWinner.winner));
//   }

//   currentTurn++;
//   isPolling = false;
// }

// function* pollScheduler() {
//   yield call(delay, 10 * 1000); // cheap wait for load

//   while (true) {
//     // Wait x seconds
//     yield call(delay, POLL_INTERVAL * 1000);

//     // Fork means we are creating a subprocess that will handle the polling
//     yield fork(pollForNewTurn/*, additional args*/);
//   }
// }

// function* loadMuleStateWatcher() {
//   while (true) {
//     // Take means the saga will block until LOAD_MULE_STATE_SUCCESS action is dispatched
//     const loadMuleStateSuccess: LoadMuleStateSuccess = yield take(constants.LOAD_MULE_STATE_SUCCESS);
//     currentTurn = loadMuleStateSuccess.gameState.mule.currentTurn;
//   }
// }

// function* submitTurnWatcher() {
//   while (true) {
//     // Take means the saga will block until SUBMIT_TURN_SUCCESS action is dispatched
//     yield take(constants.SUBMIT_TURN_SUCCESS);

//     yield pollForNewTurn();
//   }
// }


// export function* pollForNewTurnSaga() {
//   yield all([
//     pollScheduler(),
//     loadMuleStateWatcher(),
//     submitTurnWatcher(),
//   ]);
// }
