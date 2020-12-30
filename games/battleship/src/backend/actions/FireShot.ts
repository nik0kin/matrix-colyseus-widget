
// import * as _ from 'lodash';
import {
  ActionCode, MuleStateSdk, VariableMap,
} from 'mule-sdk-js';

import {
  BattleshipPlayerVariables, Coord,
  getShipOnSquare, getShipsFromM, getShotOnSquare, getPieceStateFromShip, isShipSunk,
  isValidCoord, FireShotMuleActionParams, FireShotMuleActionMetaData, setPlayerVariable, Ship, Shot,
} from '../../shared';


const PlaceShipsAction: ActionCode = {
  validateQ,
  doQ,
};

export default PlaceShipsAction;


async function validateQ(M: MuleStateSdk, lobbyPlayerId: string, _actionParams: VariableMap) {
  const gridSize: Coord = {x: 10, y: 10}; // M.getCustomBoardSettings();

  // 1. validate Action params
  if (!_actionParams.shotCoord) {
    throw new Error('missing PlaceShips Action property: shotCoord');
  }

  const actionParams: FireShotMuleActionParams = {
    shotCoord: _actionParams.shotCoord as Coord,
  };

  // 2. Is Coord within bounds?
  if (!isValidCoord(actionParams.shotCoord, gridSize)) {
    throw new Error(`shotCoord ${toString(actionParams.shotCoord)} is not a valid Coord`);
  }

  // 3. Is Coord a previous Shot?
  const playerVariables: BattleshipPlayerVariables = M.getPlayerVariables(lobbyPlayerId) as BattleshipPlayerVariables;
  const existingShotOnCoord: Shot | undefined = getShotOnSquare(actionParams.shotCoord, playerVariables.shots);
  if (existingShotOnCoord) {
    throw new Error(`shotCoord ${toString(actionParams.shotCoord)} already exists with Shot: ${toString(existingShotOnCoord)}`);
  }

  return Promise.resolve();
}

async function doQ(M: MuleStateSdk, lobbyPlayerId: string, _actionParams: VariableMap) {
  const gridSize: Coord = {x: 10, y: 10}; // M.getCustomBoardSettings();
  const playerVariables: BattleshipPlayerVariables = M.getPlayerVariables(lobbyPlayerId) as BattleshipPlayerVariables;
  const enemyShips: Ship[] = getShipsFromM(M, lobbyPlayerId === 'p1' ? 'p2' : 'p1');
  let _isShipSunk: boolean = false;

  const newShot: Shot = {
    hit: false,
    coord: _actionParams.shotCoord as Coord,
  };
  const allShots: Shot[] = [
    ...playerVariables.shots,
    newShot
  ];

  /**
   * 1. Check for ship hits
   *    - mark shot as hit/miss
   *    if Hit, check sunk,
   *       - set ship.sunk=true and mark metadata
   */
  const shipGettingShot: Ship | undefined = getShipOnSquare(gridSize, newShot.coord, enemyShips);
  if (shipGettingShot) {
    newShot.hit = true;

    if (isShipSunk(shipGettingShot, allShots)) {
      shipGettingShot.sunk = true;
      _isShipSunk = true;
      M.setPiece(shipGettingShot.id, getPieceStateFromShip(shipGettingShot));
    }
  }

  // 2. Add new Shot
  setPlayerVariable(M, lobbyPlayerId, 'shots', allShots);

  await M.persistQ();

  const metadata: FireShotMuleActionMetaData = {
    newShot,
    sunkShip: _isShipSunk ? shipGettingShot : undefined,
  };

  return metadata;
}

function toString(a: any): string {
  return JSON.stringify(a);
}
