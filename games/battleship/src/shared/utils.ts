import { Coord } from './mule-common';

// 0 = A
export function numberToLetter(i: number): string {
  return String.fromCharCode(64 + i);
}

export function getBattleshipCoordString(coord: Coord): string {
  return numberToLetter(coord.y + 1) + (coord.x + 1);
}
