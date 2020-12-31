import { each, every } from 'lodash';

import { Ship, GameState } from '../../shared';

const winConditionHook = (gameState: GameState) => {
  let winner: string | null = null;

  // EFF - it'd be an incredibly smaller amount faster to only check the player who just played
  each(['p1', 'p2'], (lobbyPlayerId: string) => {
    const playerShips = gameState.ships.filter((s) => s.ownerId === lobbyPlayerId)
    const areAllShipsSunk: boolean = every(playerShips, (ship: Ship) => ship.sunk);
    if (areAllShipsSunk) {
      winner = lobbyPlayerId === 'p1' ? 'p2' : 'p1';
    }
  });

  // It is impossible to tie in Battleship

  return winner;
};

export default winConditionHook;
