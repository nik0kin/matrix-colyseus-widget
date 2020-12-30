import * as _ from 'lodash';

import {
  GameBoard, BoardSpace,
  GameState as MuleGameState,
  PieceState,
} from 'mule-sdk-js';

import {
  Alignment,
  Coord,
  getBoardSpaceFromSquare, getPieceStateFromShip,
  Grid,
  Ship, ShipType,
  Shot,
  Square,
} from '../shared';

const width: number = 10;
const height: number = 10;

function createSquare(ownerId: string) {
  return (coord: Coord) => {
    return { coord, ownerId };
  };
}

const p1Squares: Grid<Square> = new Grid(
  { x: width, y: height },
  createSquare('p1'),
);
/*
const p2Squares: Grid<Square> = new Grid(
  { x: width, y: height },
  createSquare('p2'),
);
*/


const ships: Ship[] = [
  {
    _id: '1',
    id: 1,
    ownerId: 'p1',
    shipType: ShipType.Carrier,
    coord: { x: 1, y: 1 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    _id: '2',
    id: 2,
    ownerId: 'p1',
    shipType: ShipType.Battleship,
    coord: { x: 1, y: 3 },
    alignment: Alignment.Vertical,
    sunk: false,
  },
  {
    _id: '3',
    id: 3,
    ownerId: 'p1',
    shipType: ShipType.Cruiser,
    coord: { x: 9, y: 1 },
    alignment: Alignment.Vertical,
    sunk: false,
  },
  {
    _id: '4',
    id: 4,
    ownerId: 'p1',
    shipType: ShipType.Destroyer,
    coord: { x: 5, y: 5 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    _id: '5',
    id: 5,
    ownerId: 'p1',
    shipType: ShipType.Destroyer,
    coord: { x: 5, y: 7 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    _id: '6',
    id: 6,
    ownerId: 'p1',
    shipType: ShipType.Submarine,
    coord: { x: 9, y: 9 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
  {
    _id: '7',
    id: 7,
    ownerId: 'p1',
    shipType: ShipType.Submarine,
    coord: { x: 4, y: 8 },
    alignment: Alignment.Horizontal,
    sunk: false,
  },
];

const p1Shots: Shot[] = [
  { coord: { x: 0, y: 1 }, hit: true },
  { coord: { x: 0, y: 2 }, hit: false },
  { coord: { x: 1, y: 1 }, hit: true },
  { coord: { x: 5, y: 5 }, hit: false },
  { coord: { x: 6, y: 6 }, hit: true },
  { coord: { x: 7, y: 7 }, hit: false },
  { coord: { x: 8, y: 8 }, hit: true },
  { coord: { x: 4, y: 7 }, hit: false },
  { coord: { x: 5, y: 7 }, hit: true },
];



export function getGameBoard(): GameBoard {
  return {
    _id: 'gameBoardId_101',
    board: getBoardSpacesForGameBoard(),
    gameState: 'gameStateId_211',
    history: 'historyId_210',
    ruleBundle: {
      id: 'ruleBundleId_104',
      name: 'Battleship',
    },
    boardType: 'dynamic'
  };
}

export function getGameState(): MuleGameState {
  return {
    _id: 'gameStateId_211',
    globalVariables: {},
    pieces: getPieceStatesFromShips(),
    playerVariables: {
      p1: {
        shots: p1Shots
      },
      p2: {
        shots: []
      },
    },
    spaces: [],
  };
}

function getBoardSpacesForGameBoard(): BoardSpace[] {
  return _.map(p1Squares.toArray(), getBoardSpaceFromSquare);
}

function getPieceStatesFromShips(): PieceState[] {
  return ships
    .map((ship) => getPieceStateFromShip(ship));
}
