
import { Coord } from '../mule-common';

export enum Alignment {
  Vertical,
  Horizontal,
}

export function getRotatedAlignment(alignment: Alignment): Alignment {
  if (alignment === Alignment.Horizontal) {
    return Alignment.Vertical;
  } else {
    return Alignment.Horizontal;
  }
}

export function getAlignmentOffset(coord: Coord, alignment: Alignment): Coord {
  if (alignment === Alignment.Horizontal) {
    return coord;
  } else {
    return {
      x: coord.y,
      y: coord.x,
    };
  }
}