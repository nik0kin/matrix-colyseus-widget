import { Turn } from '../../../shared';

import * as constants from '../../constants';

export interface LoadNewTurn {
  type: constants.LOAD_NEW_TURN;
  turnNumber: number;
  newTurn: Turn;
}

export function loadNewTurn(turnNumber: number, newTurn: Turn): LoadNewTurn {
  return {
    type: constants.LOAD_NEW_TURN,
    turnNumber,
    newTurn,
  };
}
