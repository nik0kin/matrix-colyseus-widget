import { StoreState } from '../types';
import { LoadMuleStateSuccess, LoadMuleStateFailure } from '../actions';

export function loadMuleStateSuccessReducer(state: StoreState, loadMuleStateSuccess: LoadMuleStateSuccess): StoreState {
  return {
    ...state,
    isGameStateLoaded: true,
    gameState: loadMuleStateSuccess.gameState,
  };
}


export function loadMuleStateFailureReducer(state: StoreState, loadMuleStateFailure: LoadMuleStateFailure): StoreState {
  const { error } = loadMuleStateFailure;
  console.log('Something went wrong during initiliziting Mule GameState');
  console.log(error);
  console.log(error.stack);

  return {
    ...state,
    loadError: loadMuleStateFailure.error,
  };
}
