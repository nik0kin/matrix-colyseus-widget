import { MapSchema, ArraySchema } from '@colyseus/schema';

import { CoordSchema } from 'common';

import { FireShotMuleActionParams, BattleshipPlayerVariablesSchema, GameState, Shot, ShotSchema } from '../../shared';

import fireShotAction from './FireShot';

const validActionParams: FireShotMuleActionParams = {
  shotCoord: { x: 1, y: 1 },
};

function getNewState(shots: Shot[] = []) {
  return new GameState().assign({
    playerVariables: new MapSchema<BattleshipPlayerVariablesSchema>().set(
      'p1',
      new BattleshipPlayerVariablesSchema().assign({
        shots: new ArraySchema<ShotSchema>(...shots.map((s) => new ShotSchema().assign({
          ...s,
          coord: new CoordSchema().assign(s.coord)
        })))
      })
    )
  });
}

describe('Action.validate: FireShotAction', () => {
  it('should run without error', () => {
    fireShotAction.validateQ(getNewState(), 'p1', validActionParams as any);
  });

  it('should run with with invalid shot coord error', (done) => {
    const invalidActionParams: FireShotMuleActionParams = {
      shotCoord: { x: 2, y: -1 },
    };
    try {
      fireShotAction.validateQ(getNewState(), 'p1', invalidActionParams as any);
    } catch (e) {
      done();
    }
  });

  it('should run with shot exists error', (done) => {
    try {
      fireShotAction.validateQ(getNewState([{
        coord: validActionParams.shotCoord,
        hit: false,
      }]), 'p1', validActionParams as any);
    } catch (e) {
      done();
    }
  });

});
