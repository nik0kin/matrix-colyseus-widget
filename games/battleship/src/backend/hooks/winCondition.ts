import { each, every } from 'lodash';
import { MuleStateSdk, WinConditionHook } from 'mule-sdk-js';

import { getShipsFromM, Ship } from '../../shared';

const winConditionHook: WinConditionHook = async (M: MuleStateSdk) => {
  let winner: string | null = null;

  // EFF - it'd be an incredibly smaller amount faster to only check the player who just played
  each(['p1', 'p2'], (lobbyPlayerId: string) => {
    const areAllShipsSunk: boolean = every(getShipsFromM(M, lobbyPlayerId), (ship: Ship) => ship.sunk);
    if (areAllShipsSunk) {
      winner = lobbyPlayerId === 'p1' ? 'p2' : 'p1';
    }
  });

  // It is impossible to tie in Battleship

  return winner;
};

export default winConditionHook;
