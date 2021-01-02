import * as _ from 'lodash';

// TODO-quick remove and use the one from utils

export interface Coord {
  x: number;
  y: number;
}

export function getCoordString(c: Coord): string {
  return c.x + ',' + c.y;
}

export function getCoordFromString(str: string): Coord {
  const split: string[] = str.split(',');
  return {
    x: Number(split[0]),
    y: Number(split[1]),
  };
}

export class Grid<T> {
  private size: Coord;
  private _grid: T[][];

  constructor(size: Coord, createIterator: (coord: Coord) => T) {
    this.size = size;

    this._grid = [];
    _.times(size.x, (x) => {
      this._grid.push([]);
      _.times(size.y, (y) => {
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

  public toArray(): T[] {
    return _.flatten(this._grid);
  }
}

export function areCoordsEqual(coord1: Coord, coord2: Coord) {
  return coord1.x === coord2.x && coord1.y === coord2.y;
}

export function addCoords(coord1: Coord, coord2: Coord): Coord {
  return {
    x: coord1.x + coord2.x,
    y: coord1.y + coord2.y,
  };
}

export function isValidCoord(coord: Coord, gridSize: Coord): boolean {
  return coord.x >= 0 && coord.x < gridSize.x &&
    coord.y >= 0 && coord.y < gridSize.y;
}
