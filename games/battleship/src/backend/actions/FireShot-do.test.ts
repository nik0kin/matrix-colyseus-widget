
import {
  Alignment,
  FireShotMuleActionParams, ShipType, GameState, Shot, ShotSchema, BattleshipPlayerVariablesSchema, ShipSchema,
} from '../../shared';

import fireShotAction from './FireShot';
import { MapSchema, ArraySchema } from '@colyseus/schema';
import { CoordSchema } from 'common';

function getNewState(shots: Shot[] = []) {
  const cruiser = new ShipSchema().assign({
    id: 1,
    ownerId: 'p2',
    shipType: ShipType.Cruiser,
    coord: new CoordSchema().assign({ x: 0, y: 1 }),
    alignment: Alignment.Horizontal,
    sunk: false,
  });
  const ships = new ArraySchema();
  ships.push(cruiser);

  return new GameState().assign({
    ships,
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

const validActionParams: FireShotMuleActionParams = {
  shotCoord: { x: 1, y: 1 },
};

describe('Action.do: FireShotAction', () => {
  it('should run without error', () => {
    fireShotAction.doQ(getNewState(), 'p1', validActionParams)
  });

  it('should run without error (case 2)', () => {
    fireShotAction.doQ(getNewState([{
      coord: { x: 2, y: 2 },
      hit: false,
    }, {
      coord: { x: 5, y: 3 },
      hit: false,
    }]), 'p1', validActionParams);
  });

  it('should mark a ship as sunk', () => {
    const metadata = fireShotAction.doQ(getNewState([{
      coord: { x: 0, y: 1 },
      hit: false,
    }, {
      coord: { x: 2, y: 1 },
      hit: false,
    }]), 'p1', validActionParams)
    expect(metadata.sunkShip).toBeTruthy();
  });

  it('should almost sink a ship', () => {
    const metadata = fireShotAction.doQ(getNewState([{
      coord: { x: 0, y: 1 },
      hit: false,
    }]), 'p1', validActionParams);
    expect(metadata.sunkShip).toBeFalsy();
    expect(metadata.newShot.hit).toBeTruthy();
  });
});
