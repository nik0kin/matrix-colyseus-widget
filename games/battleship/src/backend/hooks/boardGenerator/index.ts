
import * as _ from 'lodash';
import { BoardGeneratorHook, VariableMap } from 'mule-sdk-js';

import { Coord, getBoardSpaceFromSquare, Grid, Square } from '../../../shared';

const boardGenerator: BoardGeneratorHook = (customBoardSettings: VariableMap, battleshipRules: VariableMap) => {

  const width: number = 10;
  const height: number = 10;

  function createSquare(ownerId: string) {
    return (coord: Coord) => {
      return { coord, ownerId };
    };
  }

  const p1Squares: Grid<Square> = new Grid(
    { x: width, y: height },
    createSquare('p1'),
  );
  const p2Squares: Grid<Square> = new Grid(
    { x: width, y: height },
    createSquare('p2'),
  );

  return Promise.resolve(
    _.map(
      _.concat(p1Squares.toArray(), p2Squares.toArray()),
      getBoardSpaceFromSquare,
    )
  );
};

export default boardGenerator;
