// import { find } from 'lodash';
import { BoardSpace, GameBoard } from 'mule-sdk-js';

import { Coord, /*getCoordFromString,*/ getCoordString, Grid } from './mule-common';
import { Square } from './types';

export function getBoardSpaceFromSquare(square: Square): BoardSpace {
  return {
    id: getCoordString(square.coord),
    class: 'Square',
    attributes: {
      ownerId: square.ownerId,
    },
    edges: [],
  };
}

export function getGridFromGameBoard(gridSize: Coord, gameBoard: GameBoard, playerRel: string): Grid<Square> {
  return new Grid<Square>(
    gridSize,
    (coord: Coord) => {
      /* uncomment if squares need attributes
      const foundBoardSpace: BoardSpace | undefined = find(gameBoard.board, (boardSpace: BoardSpace): boolean => { // TODO not efficient - O(n^2)
        const _coord: Coord = getCoordFromString(boardSpace.id);
        return !!boardSpace.attributes && boardSpace.attributes.ownerId === playerRel &&
          coord.x === _coord.x && coord.y === _coord.y;
      });
      */
      return {
        ownerId: playerRel,
        coord: coord,
        // might have other attributes later
      };
    }
  );
}
