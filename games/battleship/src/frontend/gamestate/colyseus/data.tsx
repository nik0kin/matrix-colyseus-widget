import { initial } from 'lodash';

import { GameState, Shot, Coord, Grid, isPlacementMode, Turn, Action, TurnSchema } from '../../../shared';
import { GameState as FeGameState } from '../types';
import { Player } from '../../types';

export function toFeTurn(turn: TurnSchema): Turn {
  const playerTurns: Record<string, Action> = {};
  turn.playerTurns.forEach((action, lobbyPlayerId) => {
    playerTurns[lobbyPlayerId] = {
      type: action.type,
      params: JSON.parse(action.params),
      metadata: action.metadata ? JSON.parse(action.metadata) : undefined
    };
  });
  return {
    playerTurns
  }
}

export function toFeGameState(gameState: GameState, sessionId: string): FeGameState {

  const turns = gameState.turns.map(toFeTurn);

  const players = gameState.players.reduce(
    (acc, p, i) => {
      const rel = 'p' + (i + 1);
      const player: Player = {
        playerId: p.id,
        playerRel: rel,
        name: p.name,
      };
      return {
        ...acc,
        [rel]: player
      }
    },
    {} as Record<string, Player>
  );

  // // check if player is playing
  // let currentLobbyPlayerId: string;
  let lobbyPlayerId: string = '';
  gameState.players.forEach((player, i) => {
    const _lobbyPlayerId: string = 'p' + (i + 1);
    if (player.id === sessionId) {
      lobbyPlayerId = _lobbyPlayerId;
    }
  });
  if (!lobbyPlayerId) {
    throw new Error('user is not in game');
  }
  // currentLobbyPlayerId = lobbyPlayerId;

  const currentPlayerRel: string = lobbyPlayerId;
  const opponentPlayerRel: string = 'p1' === lobbyPlayerId ? 'p2' : 'p1';

  const gridSize = { x: 10, y: 10 };

  // const nextTurnsLobbyPlayerId: string = muleSDK.fn.getWhosTurnIsIt(fullHistory);

  return {
    mule: {
      currentPlayer: players[currentPlayerRel],
      players,
      currentTurn: turns.length - 1,
      isYourTurn: sessionId === gameState.nextTurn,
      previousTurns: initial(turns),
      winner: gameState.winner ? gameState.winner : null,
    },

    yourLobbyPlayerId: currentPlayerRel,
    theirLobbyPlayerId: opponentPlayerRel,

    width: gridSize.x,
    height: gridSize.y,

    yourGrid: getGridFromSquares(gridSize, currentPlayerRel),
    theirGrid: getGridFromSquares(gridSize, opponentPlayerRel),

    isPlacementMode: isPlacementMode(gameState, currentPlayerRel),
    isOpponentPlacementMode: isPlacementMode(gameState, opponentPlayerRel),
    isGameOver: !!gameState.winner,

    yourShips: gameState.ships.filter((s) => s.ownerId === currentPlayerRel),
    theirShips: getSunkenShipsFromGameState(gameState, opponentPlayerRel),

    yourShots: gameState.playerVariables.get(currentPlayerRel).shots as Shot[],
    theirShots: gameState.playerVariables.get(opponentPlayerRel).shots as Shot[],
  };
}

function getGridFromSquares(gridSize: Coord, lobbyPlayerId: string) {
  return new Grid(gridSize, (coord) => {
    return {
      ownerId: lobbyPlayerId,
      coord: coord,
      // might have other attributes later
    };
  });
}

function getSunkenShipsFromGameState(gameState: GameState, lobbyPlayerId: string) {
  return gameState.ships.filter((s) => s.ownerId === lobbyPlayerId && s.sunk);
}
