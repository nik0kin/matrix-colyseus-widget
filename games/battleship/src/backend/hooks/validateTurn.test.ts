
import { MuleStateSdk } from 'mule-sdk-js';

import { BattleshipPlayerVariables } from '../../shared';

import validateTurn from './validateTurn';

const mockPlayerVars: BattleshipPlayerVariables = {
  hasPlacedShips: true,
  shots: [],
};

const mbackendSdkMock: Partial<MuleStateSdk> = {
  getPlayerRels: () => ['p1', 'p2'],
  addPiece: () => 1,
  persistQ: () => Promise.resolve(),
  getPlayerVariables: () => mockPlayerVars,
};

const validFireShotAction = {
  type: 'FireShot',
  params: {
    shot: { x: 1, y: 1 },
  },
};
const invalidPlaceShipsAction = {
  type: 'PlaceShips',
  params: {
    shipPlacements: [],
  },
};

describe('Hook: validateTurn', () => {
  it('should run without error', (done) => {
    validateTurn(mbackendSdkMock as MuleStateSdk, 'p1', [validFireShotAction])
      .then(() => {
        done();
      });
  });

  it('should fail because of too many actions', (done) => {
    try {
      validateTurn(mbackendSdkMock as MuleStateSdk, 'p1', [validFireShotAction, validFireShotAction]);
    } catch (e) {
      expect(e).toBeDefined();
      done();
    }
  });

  it('should fail because the player has already placed ships', (done) => {
    try {
      validateTurn(mbackendSdkMock as MuleStateSdk, 'p1', [invalidPlaceShipsAction]);
    } catch (e) {
      expect(e).toBeDefined();
      done();
    }
  });
});
