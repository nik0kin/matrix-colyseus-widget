
import * as _ from 'lodash';
import { MuleStateSdk, GameStartHook } from 'mule-sdk-js';

import { Alignment, getPieceStateFromShip, DEFAULT_GAME_START_SHIP_SETUP_COUNTS, Ship, ShipType } from '../../shared';


const gameStartHook: GameStartHook = (M: MuleStateSdk) => {

  // for each player
  _.each(M.getPlayerRels(), (lobbyPlayerId: string) => {

    // 1. add ship pieces
    _.each(DEFAULT_GAME_START_SHIP_SETUP_COUNTS, (count: number, shipType: ShipType) => {
      _.times(count, () => {
        const newShip: Ship = {
          _id: '', // addPiece will generate a realId after persistQ
          id: -1,
          ownerId: lobbyPlayerId,
          shipType,
          coord: { x: -1, y: -1 },
          alignment: Alignment.Horizontal,
          sunk: false,
        };
        M.addPiece(getPieceStateFromShip(newShip));
      });
    });

    // 2. initialize playerVariables
    M.setPlayerVariable(lobbyPlayerId, 'hasPlacedShips', false);
    M.setPlayerVariable(lobbyPlayerId, 'shots', []);
  });

  return M.persistQ();
};

export default gameStartHook;
