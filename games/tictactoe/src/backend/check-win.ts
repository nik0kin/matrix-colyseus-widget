import { ArraySchema } from '@colyseus/schema';
import { toArrayIndex } from 'utils';

export function checkWin(array: ArraySchema<string>) {
  const r0 = checkRow(array, 0);
  const r1 = checkRow(array, 1);
  const r2 = checkRow(array, 2);

  const c0 = checkColumn(array, 0);
  const c1 = checkColumn(array, 1);
  const c2 = checkColumn(array, 2);

  const d1 = checkPossible(
    array[toArrayIndex({ x: 0, y: 0 })],
    array[toArrayIndex({ x: 1, y: 1 })],
    array[toArrayIndex({ x: 2, y: 2 })],
  );
  const d2 = checkPossible(
    array[toArrayIndex({ x: 2, y: 0 })],
    array[toArrayIndex({ x: 1, y: 1 })],
    array[toArrayIndex({ x: 0, y: 2 })],
  );

  const winner = r0 || r1 || r2 || c0 || c1 || c2 || d1 || d2;
  if (winner) return winner;
}

function checkRow(array: ArraySchema<string>, y: number) {
  return checkPossible(
    array[toArrayIndex({ x: 0, y })],
    array[toArrayIndex({ x: 1, y })],
    array[toArrayIndex({ x: 2, y })],
  );
}

function checkColumn(array: ArraySchema<string>, x: number) {
  return checkPossible(
    array[toArrayIndex({ x, y: 0 })],
    array[toArrayIndex({ x, y: 1 })],
    array[toArrayIndex({ x, y: 2 })],
  );
}

function checkPossible(s1: string, s2: string, s3: string) {
  if (s1 === s2 && s2 === s3) {
    return s1;
  }
  return '';
}
