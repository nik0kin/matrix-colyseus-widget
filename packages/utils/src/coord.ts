export interface Coord {
  x: number;
  y: number;
}

export enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

export function getDistance(loc1: Coord, loc2: Coord): number {
  return Math.sqrt(Math.pow(loc1.x - loc2.x, 2) + Math.pow(loc1.y - loc2.y, 2));
}

// export function sortAscendingDistance(sourceLoc: Coord) {
//   return (mobA: { loc: Coord }, mobB: { loc: Coord }) => {
//     const distanceA = getDistance(sourceLoc, mobA.loc);
//     const distanceB = getDistance(sourceLoc, mobB.loc);
//     if (distanceA < distanceB) return -1;
//     if (distanceA > distanceB) return 1;
//     return 0;
//   };
// }

export function toCoordString(c: Coord) {
  return `${c.x},${c.y}`;
}

export function toCoord(coordString: string) {
  const [x, y] = coordString.split(',');
  return { x: Number(x), y: Number(y) };
}

export function toArrayIndex(coord: Coord) {
  return coord.y * 3 + coord.x;
}

export function areCoordsEqual(coord1: Coord, coord2: Coord) {
  return coord1.x === coord2.x && coord1.y === coord2.y;
}
