import { PLACE_SHIPS_MULE_ACTION, GameState } from '../../shared';

const validateTurnHook = (gameState: GameState, lobbyPlayerId: string, actions: any[]) => { // TODO better actions type
  const playerVariables = gameState.playerVariables.get(lobbyPlayerId);

  if (actions.length !== 1) throw new Error('a Turn must have exactly 1 PlaceShips OR 1 FireShot action');

  if (actions[0].type === PLACE_SHIPS_MULE_ACTION && playerVariables.hasPlacedShips) {
    throw new Error('player has already placed ships');
  }
};

export default validateTurnHook;
