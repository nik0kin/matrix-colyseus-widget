import { ArraySchema, MapSchema } from '@colyseus/schema';

import {
  Alignment, ShipType, /* PlaceShipsMuleActionParams */
  PlaceShipsMuleActionParams,
  ShipSchema,
  GameState,
  BattleshipPlayerVariablesSchema,
} from '../../shared';

import placeShipsAction from './PlaceShips';
import { times } from 'lodash';

function getNewState() {
  const ships = new ArraySchema<ShipSchema>();

  times(7, (i) => {
    const battleship = new ShipSchema().assign({
      id: i + 1,
      ownerId: 'p1',
      shipType: ShipType.Battleship,
      alignment: Alignment.Horizontal,
      sunk: false,
    });
    ships.push(battleship);
  });

  const map = new MapSchema<BattleshipPlayerVariablesSchema>();
  map.set(
    'p1',
    new BattleshipPlayerVariablesSchema()
  );

  return new GameState().assign({
    ships,
    playerVariables: map,
  });
}

describe('Action.do: PlaceShipsAction', () => {
  it('should run without error', () => {
    const actionParams: PlaceShipsMuleActionParams = {
      shipPlacements: [
        {
          shipId: 1,
          coord: { x: 0, y: 0 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 2,
          coord: { x: 0, y: 1 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 3,
          coord: { x: 0, y: 2 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 4,
          coord: { x: 0, y: 3 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 5,
          coord: { x: 0, y: 4 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 6,
          coord: { x: 0, y: 5 },
          alignment: Alignment.Horizontal,
        },
        {
          shipId: 7,
          coord: { x: 0, y: 6 },
          alignment: Alignment.Horizontal,
        },
      ]
    };

    placeShipsAction.doQ(getNewState(), 'p1', actionParams)
  });
});
