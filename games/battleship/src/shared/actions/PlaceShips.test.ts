import { Alignment } from '../types';

import { getPlaceShipsActionWithNewShipPlacement, getPlaceShipsParamsFromAction, ShipPlacement } from './PlaceShips';

describe('getPlaceShipsActionWithNewShipPlacement()', () => {
  const aShipPlacement: ShipPlacement = {
    shipId: 1,
    coord: { x: 1, y: 1 },
    alignment: Alignment.Horizontal
  };

  it('should add a ShipPlacement to shipPlacements array', () => {
    const action = getPlaceShipsActionWithNewShipPlacement(
      {
        type: 'PlaceShips',
        params: {
          shipPlacements: []
        }
      },
      aShipPlacement
    );

    expect(action).toBeDefined();
    expect(getPlaceShipsParamsFromAction(action).shipPlacements.length).toBe(1);
  });

  it('should not duplicate ids', () => {
    const action = getPlaceShipsActionWithNewShipPlacement(
      {
        type: 'PlaceShips',
        params: {
          shipPlacements: [aShipPlacement]
        }
      },
      {
        shipId: 2,
        coord: { x: 1, y: 2 },
        alignment: Alignment.Horizontal
      }
    );

    expect(action).toBeDefined();
    expect(
      getPlaceShipsParamsFromAction(action).shipPlacements[0].shipId !== getPlaceShipsParamsFromAction(action).shipPlacements[1].shipId
    ).toBeTruthy();
  });
});

