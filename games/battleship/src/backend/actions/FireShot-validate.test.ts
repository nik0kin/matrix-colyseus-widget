
import { MuleStateSdk } from 'mule-sdk-js';

import { BattleshipPlayerVariables, FireShotMuleActionParams } from '../../shared';

import fireShotAction from './FireShot';

const mockPlayerVariables: Partial<BattleshipPlayerVariables> = {
  shots: [],
};
const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPlayerVariables: () => mockPlayerVariables,
};

const validActionParams: FireShotMuleActionParams  = {
  shotCoord: { x: 1, y: 1},
};

describe('Action.validate: FireShotAction', () => {
  it('should run without error', (done) => {
    fireShotAction.validateQ(mbackendSdkMock as MuleStateSdk, 'p1', validActionParams as any)
      .then(() => {
        done();
      });
  });

  it('should run with with invalid shot coord error', (done) => {
    const invalidActionParams: FireShotMuleActionParams = {
      shotCoord: { x: 2, y: -1 },
    };
    fireShotAction.validateQ(mbackendSdkMock as MuleStateSdk, 'p1', invalidActionParams as any)
      .then(() => null, () => done());
  });

  it('should run with shot exists error', (done) => {
    mockPlayerVariables.shots = [{
      coord: validActionParams.shotCoord,
      hit: false,
    }];
    fireShotAction.validateQ(mbackendSdkMock as MuleStateSdk, 'p1', validActionParams as any)
      .then(() => null, () => done());
  });

});
