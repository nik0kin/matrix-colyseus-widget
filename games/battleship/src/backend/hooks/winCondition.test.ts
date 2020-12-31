
import {
  Alignment,
  Ship, ShipType, ShipSchema, GameState,
} from '../../shared';

import winCondition from './winCondition';
import { ArraySchema } from '@colyseus/schema';
import { CoordSchema } from 'common';

const mockShips: Ship[] = [
  {
    id: 1,
    ownerId: 'p1',
    shipType: ShipType.Cruiser,
    coord: { x: 0, y: 1 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    id: 2,
    ownerId: 'p1',
    shipType: ShipType.Cruiser,
    coord: { x: 4, y: 4 },
    alignment: Alignment.Horizontal,
    sunk: true,
  },
  {
    id: 3,
    ownerId: 'p2',
    shipType: ShipType.Cruiser,
    coord: { x: 4, y: 4 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    id: 4,
    ownerId: 'p2',
    shipType: ShipType.Cruiser,
    coord: { x: 1, y: 9 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
];

function getNewState(firstShipSunk?: boolean) {
  const ships = new ArraySchema<ShipSchema>();

  mockShips.forEach((s) => {
    const ship = new ShipSchema().assign({ ...s, coord: new CoordSchema().assign(s.coord) });
    ships.push(ship);
  });

  ships.at(0).sunk = !!firstShipSunk;

  return new GameState().assign({
    ships,
  });
}

describe('Hook: winCondition', () => {
  it('should not return a winner', () => {
    const winner = winCondition(getNewState())
    expect(winner).toBeNull();
  });

  it('should return a winner', () => {
    const winner = winCondition(getNewState(true))
    expect(winner).toBe('p2');
  });
});
