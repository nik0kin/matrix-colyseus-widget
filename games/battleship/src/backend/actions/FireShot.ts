import {
  Coord, Ship, Shot, GameState, ShotSchema,
  getShipOnSquare, getShotOnSquare, isShipSunk,
  isValidCoord, FireShotMuleActionParams, FireShotMuleActionMetaData,
} from '../../shared';
import { CoordSchema } from 'common';


const PlaceShipsAction = {
  validateQ,
  doQ,
};

export default PlaceShipsAction;


function validateQ(gameState: GameState, lobbyPlayerId: string, actionParams: FireShotMuleActionParams) {
  const gridSize: Coord = { x: 10, y: 10 }; // M.getCustomBoardSettings();

  // 1. validate Action params
  if (!actionParams.shotCoord) {
    throw new Error('missing PlaceShips Action property: shotCoord');
  }

  // 2. Is Coord within bounds?
  if (!isValidCoord(actionParams.shotCoord, gridSize)) {
    throw new Error(`shotCoord ${toString(actionParams.shotCoord)} is not a valid Coord`);
  }

  // 3. Is Coord a previous Shot?
  const playerVariables = gameState.playerVariables.get(lobbyPlayerId);
  const existingShotOnCoord: Shot | undefined = getShotOnSquare(actionParams.shotCoord, playerVariables.shots);
  if (existingShotOnCoord) {
    throw new Error(`shotCoord ${toString(actionParams.shotCoord)} already exists with Shot: ${toString(existingShotOnCoord)}`);
  }
}

function doQ(gameState: GameState, lobbyPlayerId: string, actionParams: FireShotMuleActionParams) {
  const gridSize: Coord = { x: 10, y: 10 }; // M.getCustomBoardSettings();
  const playerVariables = gameState.playerVariables.get(lobbyPlayerId);
  const enemy = lobbyPlayerId === 'p1' ? 'p2' : 'p1';
  const enemyShips: Ship[] = gameState.ships.filter((s) => s.ownerId === enemy);
  let _isShipSunk: boolean = false;

  // 1. Add new Shot
  const newShot = new ShotSchema().assign({
    coord: new CoordSchema().assign(actionParams.shotCoord),
  });
  playerVariables.shots.push(newShot);

  /**
   * 2. Check for ship hits
   *    - mark shot as hit/miss
   *    if Hit, check sunk,
   *       - set ship.sunk=true and mark metadata
   */
  const shipGettingShot: Ship | undefined = getShipOnSquare(gridSize, newShot.coord, enemyShips);
  if (shipGettingShot) {
    newShot.hit = true;

    if (isShipSunk(shipGettingShot, playerVariables.shots)) {
      shipGettingShot.sunk = true;
      _isShipSunk = true;
      // M.setPiece(shipGettingShot.id, getPieceStateFromShip(shipGettingShot));
    }
  }

  const metadata: FireShotMuleActionMetaData = {
    newShot,
    sunkShip: _isShipSunk ? shipGettingShot : undefined,
  };

  return metadata;
}

function toString(a: any): string {
  return JSON.stringify(a);
}
