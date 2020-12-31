import { Turn } from '../../../shared';

import * as constants from '../../constants';

export interface LoadNewTurn {
  type: constants.LOAD_NEW_TURN;
  newTurn: Turn;
}

export function loadNewTurn(newTurn: Turn): LoadNewTurn {
  return {
    type: constants.LOAD_NEW_TURN,
    newTurn,
  };
}
