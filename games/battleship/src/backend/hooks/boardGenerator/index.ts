
import * as _ from 'lodash';

import { Coord, Grid, Square, SquareSchema } from '../../../shared';
import { CoordSchema } from 'common';

const boardGenerator = () => {
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

  return _.concat(p1Squares.toArray(), p2Squares.toArray())
    .map((s) => new SquareSchema().assign({ ...s, coord: new CoordSchema().assign(s.coord) }));
};

export default boardGenerator;
