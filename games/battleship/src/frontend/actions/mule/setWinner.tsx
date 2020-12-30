import * as constants from '../../constants';

export interface SetWinner {
  type: constants.SET_WINNER;
  winner: string; // lobbyPlayerId
}

export function setWinner(winner: string): SetWinner {
  return {
    type: constants.SET_WINNER,
    winner,
  };
}
