
import { MuleStateSdk, PieceState } from 'mule-sdk-js';

import {
  Alignment,
  getPieceStateFromShip, Ship, ShipType,
} from '../../shared';

import winCondition from './winCondition';

const mockShips: Ship[] = [
  {
    _id: '',
    id: 1,
    ownerId: 'p1',
    shipType: ShipType.Cruiser,
    coord: { x: 0, y: 1 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    _id: '',
    id: 2,
    ownerId: 'p1',
    shipType: ShipType.Cruiser,
    coord: { x: 4, y: 4 },
    alignment: Alignment.Horizontal,
    sunk: true,
  },
  {
    _id: '',
    id: 3,
    ownerId: 'p2',
    shipType: ShipType.Cruiser,
    coord: { x: 4, y: 4 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    _id: '',
    id: 4,
    ownerId: 'p2',
    shipType: ShipType.Cruiser,
    coord: { x: 1, y: 9 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
];

const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPieces: ({ownerId}) => mockShips
    .map(getPieceStateFromShip)
    .filter((ps: PieceState) => ps.ownerId === ownerId),
};


describe('Hook: winCondition', () => {
  it('should not return a winner', (done) => {
    winCondition(mbackendSdkMock as MuleStateSdk)
      .then((winner: string | null) => {
        expect(winner).toBeNull();
        done();
      });
  });

  it('should return a winner', (done) => {
    mockShips[0].sunk = true;
    winCondition(mbackendSdkMock as MuleStateSdk)
      .then((winner: string | null) => {
        expect(winner).toBe('p2');
        done();
      });
  });
});
