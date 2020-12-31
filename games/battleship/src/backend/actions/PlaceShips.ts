
import * as _ from 'lodash';

import {
  addCoords, Coord, getAlignmentOffset,
  getShipStructure, getTotalShipsPerPlayer, Grid, isValidCoord,
  PlaceShipsMuleActionParams, ShipPlacement,
  ShipStructure, GameState, setPlayerVariable,
} from '../../shared';
import { CoordSchema } from 'common';


const PlaceShipsAction = {
  validateQ,
  doQ,
};

export default PlaceShipsAction;


function validateQ(gameState: GameState, lobbyPlayerId: string, _actionParams: PlaceShipsMuleActionParams) {
  const gridSize: Coord = { x: 10, y: 10 }; // M.getCustomBoardSettings();
  const placedShips: number[] = [];
  const occupiedGrid: Grid<boolean> = new Grid<boolean>(gridSize, () => false);

  // 1. validate Action params
  if (!_actionParams.shipPlacements) {
    throw new Error('missing PlaceShips Action property: shipPlacements');
  }

  const actionParams: PlaceShipsMuleActionParams = {
    shipPlacements: _actionParams.shipPlacements as ShipPlacement[],
  };

  // 2. validate each ShipPlacement
  _.each(actionParams.shipPlacements, (shipPlacement: ShipPlacement) => {

    // 2a. is shipId valid?
    const ship = gameState.ships.find((s) => s.id === shipPlacement.shipId);
    if (!ship) {
      throw new Error('invalid shipId: ' + shipPlacement.shipId);
    }

    // 2b. has ship already been placed (within this Action)?
    if (_.includes(placedShips, shipPlacement.shipId)) {
      throw new Error(`ship(id=${shipPlacement.shipId}) has already been placed`);
    }

    // 2c. does ship belong to currentPlayer?
    if (ship.ownerId !== lobbyPlayerId) {
      throw new Error(`player does not own ship(id=${shipPlacement.shipId})`);
    }

    // 2d. is the ship placement coordinates valid?
    if (!isValidCoord(shipPlacement.coord, gridSize)) {
      throw new Error(
        `invalid shipPlacement coord: ${shipPlacement.coord.x},${shipPlacement.coord.y} (shipId=${shipPlacement.shipId})`
      );
    }

    // 2e. are the coordinates of each ship square valid and unoccupied?
    const shipStructure: ShipStructure = getShipStructure(ship.shipType);
    const invalidShipSquares: Coord[] = [];

    _.each(shipStructure.squares, (relativeCoord: Coord) => {
      const shipSquareCoord: Coord = addCoords(
        shipPlacement.coord,
        getAlignmentOffset(relativeCoord, shipPlacement.alignment)
      );

      if (!isValidCoord(shipSquareCoord, gridSize) || occupiedGrid.get(shipSquareCoord)) {
        invalidShipSquares.push(shipSquareCoord);
      } else {
        occupiedGrid.set(shipSquareCoord, true);
      }
    });

    if (invalidShipSquares.length) {
      const invalidShipSquaresStr: string = JSON.stringify(invalidShipSquares);
      throw new Error(
        `invalid shipPlacement coord: ${shipPlacement.coord.x},${shipPlacement.coord.y} (shipId=${shipPlacement.shipId})
         with ${invalidShipSquaresStr} ship square(s)`
      );
    }

    placedShips.push(shipPlacement.shipId);
  });

  // 3. are all ships placed?
  if (placedShips.length !== getTotalShipsPerPlayer()) {
    throw new Error('all ships are not placed');
  }
}

function doQ(gameState: GameState, lobbyPlayerId: string, actionParams: PlaceShipsMuleActionParams) {

  actionParams.shipPlacements.forEach((shipPlacement: ShipPlacement) => {
    const ship = gameState.ships.find((s) => s.id === shipPlacement.shipId)!;
    ship.coord = new CoordSchema().assign(shipPlacement.coord);
    ship.alignment = shipPlacement.alignment;
  });

  setPlayerVariable(gameState, lobbyPlayerId, 'hasPlacedShips', true);
}

