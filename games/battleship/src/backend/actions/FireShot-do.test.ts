
import { MuleStateSdk } from 'mule-sdk-js';

import {
  Alignment, BattleshipPlayerVariables, FireShotMuleActionMetaData,
  getPieceStateFromShip, FireShotMuleActionParams, ShipType,
} from '../../shared';

import fireShotAction from './FireShot';

const mockPlayerVariables: Partial<BattleshipPlayerVariables> = {
  shots: [],
};
const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPlayerVariables: () => mockPlayerVariables,
  getPieces: () => [getPieceStateFromShip({
    _id: '',
    id: 1,
    ownerId: 'p1',
    shipType: ShipType.Cruiser,
    coord: { x: 0, y: 1 },
    alignment: Alignment.Horizontal,
    sunk: false,
  })],
  setPlayerVariable: () => null,
  setPiece: () => null,
  persistQ: () => Promise.resolve(),
};

const validActionParams: FireShotMuleActionParams  = {
  shotCoord: { x: 1, y: 1},
};

describe('Action.do: FireShotAction', () => {
  it('should run without error', (done) => {
    fireShotAction.doQ(mbackendSdkMock as MuleStateSdk, 'p1', validActionParams as any)
      .then(() => {
        done();
      });
  });

  it('should run without error (case 2)', (done) => {
    mockPlayerVariables.shots = [{
      coord: { x: 2, y: 2},
      hit: false,
    }, {
      coord: { x: 5, y: 3},
      hit: false,
    }];
    fireShotAction.doQ(mbackendSdkMock as MuleStateSdk, 'p1', validActionParams as any)
      .then(() => done());
  });

  it('should mark a ship as sunk', (done) => {
    mockPlayerVariables.shots = [{
      coord: { x: 0, y: 1},
      hit: false,
    }, {
      coord: { x: 2, y: 1},
      hit: false,
    }];
    fireShotAction.doQ(mbackendSdkMock as MuleStateSdk, 'p1', validActionParams as any)
      .then((metadata: FireShotMuleActionMetaData) => {
        expect(metadata.sunkShip).toBeTruthy();
        done();
      });
  });

  it('should almost sink a ship', (done) => {
    mockPlayerVariables.shots = [{
      coord: { x: 0, y: 1},
      hit: false,
    }];
    fireShotAction.doQ(mbackendSdkMock as MuleStateSdk, 'p1', validActionParams as any)
      .then((metadata: FireShotMuleActionMetaData) => {
        expect(metadata.sunkShip).toBeFalsy();
        expect(metadata.newShot.hit).toBeTruthy();
        done();
      });
  });
});
