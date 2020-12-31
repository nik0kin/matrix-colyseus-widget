import * as _ from 'lodash';

import { Alignment, DEFAULT_GAME_START_SHIP_SETUP_COUNTS, ShipType, GameState, ShipSchema, BattleshipPlayerVariablesSchema } from '../../shared';

const gameStartHook = (gameState: GameState) => {
  let idCounter = 1;

  // for each player
  _.each(gameState.players, (player, i) => {
    const lobbyPlayerId = 'p' + (i + 1);

    // 1. add ship pieces
    _.each(DEFAULT_GAME_START_SHIP_SETUP_COUNTS, (count, shipType) => {
      _.times(count, () => {
        const newShip = new ShipSchema().assign({
          id: idCounter++,
          ownerId: lobbyPlayerId,
          shipType: shipType as ShipType,
          alignment: Alignment.Horizontal,
          sunk: false,
        });
        gameState.ships.push(newShip);
      });
    });

    // 2. initialize playerVariables
    gameState.playerVariables.set(lobbyPlayerId, new BattleshipPlayerVariablesSchema());
  });
};

export default gameStartHook;
