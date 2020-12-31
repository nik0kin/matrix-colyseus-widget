import * as React from 'react';
import * as _ from 'lodash';

import {
  addCoords, Coord, doesShipIdExistInShipPlacements, getAlignmentOffset,
  getPlaceShipsParamsFromAction, getInvalidShipPlacements, getShipStructure, getShotOnSquare,
  isShipPlaced, Ship, ShipPlacement, Shot, Action,
} from '../../../shared';

import './style.css';

type SelectShipListShipFn = (shipId: number) => void;

export interface Props {
  isPlacementMode: boolean;
  yourLobbyPlayerId: string;
  gridSize: Coord;
  yourShips: Ship[];
  theirShips: Ship[];
  yourShots: Shot[];
  theirShots: Shot[];
  pendingActions: Action[];
  selectedShipBeingPlaced: number | undefined;
  selectShipListShip: SelectShipListShipFn;
}

function ShipList({
  isPlacementMode,
  yourLobbyPlayerId,
  gridSize,
  yourShips,
  theirShips,
  yourShots,
  theirShots,
  pendingActions,
  selectedShipBeingPlaced,
  selectShipListShip
}: Props) {

  let invalidShipPlacements: ShipPlacement[] = [];

  if (isPlacementMode) {
    const shipPlacements: ShipPlacement[] = getPlaceShipsParamsFromAction(pendingActions[0]).shipPlacements;
    invalidShipPlacements = getInvalidShipPlacements(yourLobbyPlayerId, gridSize, yourShips, shipPlacements);
  }

  return (
    <div className={'ShipList ' + (isPlacementMode ? 'placement-mode' : '')}>
      <div className="your-ship-list">
        <div className="list-title"> Your Ships </div>
        {getShipList(yourShips, pendingActions, selectShipListShip, selectedShipBeingPlaced, invalidShipPlacements, theirShots)}
      </div>

      <div className="their-ship-list">
        <div className="list-title"> Opponent's Ships </div>
        {getShipList(theirShips, [], _.noop, undefined, [], yourShots)}
      </div>
    </div>
  );
}

export default ShipList;

function getShipList(
  ships: Ship[],
  pendingActions: Action[],
  selectShipListShip: SelectShipListShipFn,
  selectedShipBeingPlaced: number | undefined,
  invalidShipPlacements: ShipPlacement[],
  opponentShots: Shot[],
): JSX.Element {
  const sortedShips: Ship[] = _.sortBy(ships, (ship: Ship) => {
    return -getShipStructure(ship.shipType).squares.length; // longest first
  });

  const shipsHtml: JSX.Element[] = _.map(sortedShips, (ship: Ship) => {
    const key: string = ship.id + ' ' + ship.shipType;
    const isPlaced: boolean = isShipPlaced(ship.id, pendingActions);
    const isCollided: boolean = isPlaced && doesShipIdExistInShipPlacements(invalidShipPlacements, ship.id);

    return (
      <div key={key} onClick={() => selectShipListShip(ship.id)}>
        <div className="ship-name">
          {ship.shipType}
        </div>
        <div>
          {getShipListShip(
            ship,
            selectedShipBeingPlaced === ship.id,
            isPlaced,
            isCollided,
            opponentShots,
            key
          )}
        </div>
      </div>
    );
  });

  return (
    <div>
      {shipsHtml}
    </div>
  );
}

function getShipListShip(
  ship: Ship,
  isPlacing: boolean,
  isPlaced: boolean,
  isCollided: boolean,
  opponentShots: Shot[],
  key: string,
): JSX.Element {
  // TODO this needs to be changed to show non linear ship structures
  const shipSquares: Coord[] = getShipStructure(ship.shipType).squares;
  const length: number = shipSquares.length;
  const rowHtml: JSX.Element[] = [];

  _.times(length, (i) => {
    let _class: string = 'ship ';
    let cellContent: string = '';

    const squareCoord: Coord = addCoords(ship.coord, getAlignmentOffset(shipSquares[i], ship.alignment));

    const possibleShot: Shot | undefined = getShotOnSquare(squareCoord, opponentShots);
    if (possibleShot) {
      _class += possibleShot.hit ? 'hit-shot ' : 'miss-shot ';
      cellContent = possibleShot.hit ? 'X' : '/';
    }

    rowHtml.push(
      <td className={_class} key={key + '-s' + i}>
        {cellContent}
      </td>
    );
  });

  let className: string = 'shiplist-ship ';

  if (isPlacing) {
    className += ' placing';
  } else if (isPlaced) {
    className += ' placed';
  }

  if (isCollided) {
    className += ' collision';
  }

  return (
    <table className={className}>
      <tbody>
        <tr>
          {rowHtml}
        </tr>
      </tbody>
    </table>
  );
}
