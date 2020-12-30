import { Turn } from 'mule-sdk-js';

import { Ship, Grid, Square, Shot } from '../../../shared';

import { Player, PlayerMap } from '../../types';

export interface GameState {
  mule: {
    currentPlayer: Player;
    players: PlayerMap;
    currentTurn: number;
    isYourTurn: boolean;
    previousTurns: Turn[];
    winner: string | null; // lobbyPlayerId
  };

  yourLobbyPlayerId: string;
  theirLobbyPlayerId: string;

  width: number;
  height: number;
  yourGrid: Grid<Square>;
  theirGrid: Grid<Square>;

  isPlacementMode: boolean;
  isOpponentPlacementMode: boolean;
  isGameOver: boolean;

  yourShips: Ship[];
  theirShips: Ship[];

  yourShots: Shot[];
  theirShots: Shot[];
}
