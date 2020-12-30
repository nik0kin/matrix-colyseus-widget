
import { MuleStateSdk, ValidateTurnHook, VariableMap } from 'mule-sdk-js';

import { BattleshipPlayerVariables, PLACE_SHIPS_MULE_ACTION } from '../../shared';

const validateTurnHook: ValidateTurnHook = (M: MuleStateSdk, lobbyPlayerId: string, actions: VariableMap[]) => { // TODO better actions type
  const playerVariables: BattleshipPlayerVariables = M.getPlayerVariables(lobbyPlayerId);

  if (actions.length !== 1) throw new Error('a Turn must have exactly 1 PlaceShips OR 1 FireShot action');

  if (actions[0].type === PLACE_SHIPS_MULE_ACTION && playerVariables.hasPlacedShips) {
    throw new Error('player has already placed ships');
  }

  return Promise.resolve();
};

export default validateTurnHook;
