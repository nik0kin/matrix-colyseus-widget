import {
  Alignment, ShipType, PlaceShipsMuleActionParams,
  ShipSchema, GameState
} from '../../shared';

import placeShipsAction from './PlaceShips';
import { ArraySchema } from '@colyseus/schema';

const placeShipsWithRotationsActionParams: PlaceShipsMuleActionParams = {
  shipPlacements: [
    {
      shipId: 9819112,
      coord: { x: 6, y: 4 },
      alignment: 1
    },
    {
      shipId: 14723,
      coord: { x: 6, y: 3 },
      alignment: 1
    },
    {
      shipId: 5528858,
      coord: { x: 5, y: 3 },
      alignment: 0
    },
    {
      shipId: 1010484,
      coord: { x: 5, y: 2 },
      alignment: 1
    },
    {
      shipId: 7231084,
      coord: { x: 5, y: 1 },
      alignment: 1
    },
    {
      shipId: 7471961,
      coord: { x: 4, y: 1 },
      alignment: 0
    },
    {
      shipId: 2489142,
      coord: { x: 4, y: 0 },
      alignment: 1
    }]
};

function getNewState(params: PlaceShipsMuleActionParams) {
  const ships = new ArraySchema<ShipSchema>();

  params.shipPlacements.forEach((sp) => {
    const battleship = new ShipSchema().assign({
      id: sp.shipId,
      ownerId: 'p1',
      shipType: ShipType.Battleship,
      alignment: Alignment.Horizontal,
      sunk: false,
    });
    ships.push(battleship);
  });

  return new GameState().assign({
    ships,
  });
}

describe('Action.validate: PlaceShipsAction', () => {
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

    placeShipsAction.validateQ(getNewState(actionParams), 'p1', actionParams);
  });

  it('should run without error2', () => {
    placeShipsAction.validateQ(getNewState(placeShipsWithRotationsActionParams), 'p1', placeShipsWithRotationsActionParams);
  });
});
