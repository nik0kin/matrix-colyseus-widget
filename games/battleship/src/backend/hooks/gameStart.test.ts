
import { MuleStateSdk } from 'mule-sdk-js';

import gameStart from './gameStart';

const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPlayerRels: () => ['p1', 'p2'],
  addPiece: () => 1,
  persistQ: () => Promise.resolve(),
  setPlayerVariable: () => null,
};

describe('Hook: gameStart', () => {
  it('should run without error', (done) => {
    gameStart(mbackendSdkMock as MuleStateSdk)
      .then(() => {
        done();
      });
  });

  it('should create 14 ships', (done) => {
    let shipCount: number = 0;
    mbackendSdkMock.addPiece = () => {
      return shipCount++;
    };

    gameStart(mbackendSdkMock as MuleStateSdk)
      .then(() => {
        expect(shipCount).toBe(14);
        done();
      });
  });
});
