import { flatten, times } from 'lodash';

import { Coord } from './coord';

export class Grid<T> {
  private size: Coord;
  private _grid: T[][];

  constructor(size: Coord, createIterator: (coord: Coord) => T) {
    this.size = size;

    this._grid = [];
    times(size.x, (x) => {
      this._grid.push([]);
      times(size.y, (y) => {
        this._grid[x][y] = createIterator({ x, y });
      });
    });
  }

  public get(coord: Coord): T {
    return this._grid[coord.x][coord.y];
  }

  public set(coord: Coord, t: T): void {
    this._grid[coord.x][coord.y] = t;
  }

  public getSize(): Coord {
    return this.size;
  }

  // X index first: _grid[x][y]
  public get2DArray(): T[][] {
    return this._grid;
  }

  // Y index first: _grid[y][x]
  // TODO QUICK constructor option?
  public get2DArrayWithFlippedIndexes(): T[][] {
    const _flippedGrid: T[][] = [];
    times(this.size.y, (y) => {
      _flippedGrid.push([]);
      times(this.size.x, (x) => {
        _flippedGrid[y][x] = this._grid[x][y];
      });
    });

    return _flippedGrid;
  }

  public toArray(): T[] {
    return flatten(this._grid);
  }
}
