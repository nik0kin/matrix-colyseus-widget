import * as _ from 'lodash';
import { TokenPiece, CustomSettings, SpotSpace } from './common';
import { ArraySchema } from '@colyseus/schema';
import { Coord } from 'utils';

export const winConditionHook = function (
  spots: ArraySchema<SpotSpace>, tokens: ArraySchema<TokenPiece>,
  { width, height, connectAmount }: CustomSettings,
  lastPlayer: string,
  { droppedToLocation: lastDroppedCoord }: { droppedToLocation: Coord }
): 'tie' | string | undefined {
  const board = getBoardArray({ width, height, connectAmount }, tokens);

  const getWhoOccupysSpace = function (pos: Coord) {
    if (pos.x < 1 || pos.y < 1
      || pos.x > width || pos.y > height) {
      return undefined;
    }
    return board[pos.x - 1][pos.y - 1].occupied;
  };

  // console.log('Checking if dropping to ' + JSON.stringify(lastDroppedCoord) + ' is the winning move');

  const checkRecurs = function (pos: Coord, xChange: number, yChange: number): number {
    pos = { x: pos.x + xChange, y: pos.y + yChange };
    var posPlayer = getWhoOccupysSpace(pos);
    // console.log(JSON.stringify(pos) + ' ' + JSON.stringify(posPlayer));
    if (!posPlayer || posPlayer != lastPlayer) {
      return 0;
    }

    return 1 + checkRecurs(pos, xChange, yChange);
  };

  var leftRight = 1 + checkRecurs(lastDroppedCoord, -1, 0) + checkRecurs(lastDroppedCoord, 1, 0),
    topBottom = 1 + checkRecurs(lastDroppedCoord, 0, -1) + checkRecurs(lastDroppedCoord, 0, 1),
    leftDiag = 1 + checkRecurs(lastDroppedCoord, -1, 1) + checkRecurs(lastDroppedCoord, 1, -1),
    rightDiag = 1 + checkRecurs(lastDroppedCoord, -1, -1) + checkRecurs(lastDroppedCoord, 1, 1);

  if (leftRight >= connectAmount || topBottom >= connectAmount ||
    leftDiag >= connectAmount || rightDiag >= connectAmount) {
    return lastPlayer;
  }

  if (tokens.length === width * height) {
    return 'tie';
  }
};

const getBoardArray = function (customBoardSettings: CustomSettings, tokens: ArraySchema<TokenPiece>): Array<Array<{ occupied?: string }>> {
  var board: Array<Array<{ occupied?: string }>> = [];
  _.times(customBoardSettings.width, function () {
    var row: Array<{ occupied?: string }> = [];
    _.times(customBoardSettings.height, function () {
      row.push({});
    });
    board.push(row);
  });

  _.each(tokens, function (piece) {
    board[piece.x - 1][piece.y - 1].occupied = piece.ownerId;
  });
  return board;
};

