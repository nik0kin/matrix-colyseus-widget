import { each, filter, reduce, times } from 'lodash';

import {
  initializeMuleSdk, FullRoundRobinHistory,
  SDK,
  Game, GameBoard,
  GameState as MuleGameState,
  PlayersMap as MulePlayerMap,
  User, Turn,
} from 'mule-sdk-js';

import {
  getGridFromGameBoard, getShipsFromGameState, getShotsFromGameState,
  isPlacementMode, RULEBUNDLE_NAME, Ship,
} from '../../../shared';
import {
  GameState,
  Player,
  PlayerMap,
} from '../../types';

let gameId: string | undefined;
let currentLobbyPlayerId: string;

let muleSDK: SDK;

function initMuleSdk(contextPath: string): void {
  muleSDK = initializeMuleSdk(contextPath);
}

export function getSdk(): SDK {
  return muleSDK;
}

export function getGameId(): string {
  if (!gameId) {
    throw 'gameId doesnt exist';
  }

  return gameId;
}

export function getLobbyPlayerId(): string {
  return currentLobbyPlayerId;
}

interface MulePlayerMapPlayer {
  playerId: string;
  playerStatus: string;
  name?: string;
}

function convertToPlayerMap(playerMap: MulePlayerMap): PlayerMap {
  return reduce(
    playerMap,
    (i: PlayerMap, p: MulePlayerMapPlayer, playerRel: string) => {
      i[playerRel] = {
        playerId: p.playerId,
        playerRel,
        name: p.name || 'No Mule Username?',
      };
      return i;
    },
    {}
  );
}

export async function getBattleshipGameState(): Promise<GameState> {

  initMuleSdk(getMuleApiPath());

  gameId = muleSDK.fn.getUrlParameter('gameId');
  if (!gameId) {
    throw new Error('missing gameId in url');
  }

  // load session
  let user: User;
  let lobbyPlayerId: string = '';
  try {
    user = await muleSDK.Users.sessionQ();
  } catch (e) {
    throw new Error('user has no session');
  }

  // get Game
  const loadedGame: Game = await muleSDK.Games.readQ(gameId);

  if (loadedGame.gameStatus === 'open') {
    throw new Error('game has not started');
  }

  if (loadedGame.ruleBundle.name !== RULEBUNDLE_NAME) {
    throw new Error(`gameId RuleBundle does not match ${RULEBUNDLE_NAME}: ` + loadedGame.ruleBundle.name);
  }

  // get GameBoard
  const loadedGameBoard: GameBoard = await muleSDK.GameBoards.readQ(loadedGame.gameBoard);

  // get GameState
  const loadedGameState: MuleGameState = await muleSDK.GameStates.readQ(loadedGameBoard.gameState);

  // get History w/ Turns
  const fullHistory: FullRoundRobinHistory = await muleSDK.Historys.readGamesFullHistoryQ(loadedGame._id) as FullRoundRobinHistory;
  const turnsArray: Turn[] = getPreviousTurnsArray(fullHistory);

  // TODO get Turns

  const players: PlayerMap = convertToPlayerMap(await muleSDK.Games.getPlayersMapQ(loadedGame));

  // check if player is playing
  each(players, (player: Player, _lobbyPlayerId: string) => {
    if (player.playerId === user._id) {
      lobbyPlayerId = _lobbyPlayerId;
    }
  });
  if (!lobbyPlayerId) {
    throw new Error('user is not in game');
  }
  currentLobbyPlayerId = lobbyPlayerId;

  const currentPlayerRel: string = lobbyPlayerId;
  const opponentPlayerRel: string = 'p1' === lobbyPlayerId ? 'p2' : 'p1';

  const gridSize = { x: 10, y: 10 };

  const nextTurnsLobbyPlayerId: string = muleSDK.fn.getWhosTurnIsIt(fullHistory);

  return {
    mule: {
      currentPlayer: players[currentPlayerRel],
      players,
      currentTurn: fullHistory.currentTurn,
      isYourTurn: currentPlayerRel === nextTurnsLobbyPlayerId,
      previousTurns: turnsArray,
      winner: fullHistory.winner ? fullHistory.winner : null,
    },

    yourLobbyPlayerId: currentPlayerRel,
    theirLobbyPlayerId: opponentPlayerRel,

    width: gridSize.x,
    height: gridSize.y,

    yourGrid: getGridFromGameBoard(gridSize, loadedGameBoard, currentPlayerRel),
    theirGrid: getGridFromGameBoard(gridSize, loadedGameBoard, opponentPlayerRel),

    isPlacementMode: isPlacementMode(loadedGameState, currentPlayerRel),
    isOpponentPlacementMode: isPlacementMode(loadedGameState, opponentPlayerRel),
    isGameOver: !!fullHistory.winner,

    yourShips: getShipsFromGameState(loadedGameState, currentPlayerRel),
    theirShips: getSunkenShipsFromGameState(loadedGameState, opponentPlayerRel),

    yourShots: getShotsFromGameState(loadedGameState, currentPlayerRel),
    theirShots: getShotsFromGameState(loadedGameState, opponentPlayerRel),
  };
}

function getMuleApiPath(): string {
  const hostname: string = window && window.location && window.location.hostname;

  if (hostname === 'localhost') {
    return 'http://localhost:313/webservices/';
  } else {
    return '/webservices/';
  }
}

function getPreviousTurnsArray(fullHistory: FullRoundRobinHistory): Turn[] {
  let turns: Turn[] = [];
  times(fullHistory.currentRound, (roundI: number) => {
    const roundTurns: Turn[] = fullHistory.turns[roundI];
    turns = turns.concat(roundTurns);
  });
  return turns;
}

function getSunkenShipsFromGameState(gameState: MuleGameState, lobbyPlayerId: string): Ship[] {
  return filter(getShipsFromGameState(gameState, lobbyPlayerId), (ship: Ship) => ship.sunk);
}
