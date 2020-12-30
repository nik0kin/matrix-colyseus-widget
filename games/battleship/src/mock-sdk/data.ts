import {
  MockSdk,
  TurnProgressStyle,
} from 'mule-sdk-js';

import {
  getGameBoard, getGameState,
} from './build-testmap';

export function initMockData() {
  MockSdk.addMockData({
    Users: [
      {
        _id: 'playerId_102',
        username: 'Nik',
      },
      {
        _id: 'playerId_103',
        username: 'Nadia',
      },
    ],
    Games: [
      {
        _id: 'gameId_1',
        gameBoard: 'gameBoardId_101',
        gameStatus: 'inprogress',
        maxPlayers: 2,
        players: {
          'p1': {
            playerId: 'playerId_102',
            playerStatus: 'inGame'
          },
          'p2': {
            playerId: 'playerId_103',
            playerStatus: 'inGame'
          },
        },
        name: '1v1 pros only',
        nextTurnTime: new Date(),
        ruleBundle: {
          id: 'ruleBundleId_104',
          name: 'Battleship',
        },
        ruleBundleGameSettings: {
          customBoardSettings: {},
        },
        turnProgressStyle: TurnProgressStyle.WaitProgress,
        turnTimeLimit: -1,
      }
    ],
    GameBoards: [getGameBoard()],
    GameStates: [getGameState()],
  });
}
