
import { StoreState } from '../types';
import { SetWinner } from '../actions';

export function setWinnerReducer(state: StoreState, setWinner: SetWinner): StoreState {
  return {
    ...state,
    gameState: {
      ...state.gameState,
      mule: {
        ...state.gameState.mule,
        winner: setWinner.winner,
      },
      isGameOver: true,
    }
  };
}
