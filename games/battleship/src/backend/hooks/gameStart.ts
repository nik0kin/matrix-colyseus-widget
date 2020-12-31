
import * as _ from 'lodash';

import { Alignment, DEFAULT_GAME_START_SHIP_SETUP_COUNTS, ShipType, GameState, ShipSchema, BattleshipPlayerVariablesSchema } from '../../shared';


const gameStartHook = (gameState: GameState) => {

  // for each player
  _.each(gameState.players, (player, i) => {
    const lobbyPlayerId = 'p' + (i + 1);

    // 1. add ship pieces
    _.each(DEFAULT_GAME_START_SHIP_SETUP_COUNTS, (count: number, shipType: ShipType) => {
      _.times(count, () => {
        const newShip = new ShipSchema().assign({
          id: -1, // TODO-fork generate id based of state.idCounter
          ownerId: lobbyPlayerId,
          shipType,
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
