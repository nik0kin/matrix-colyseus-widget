import { type, ArraySchema, Schema, MapSchema } from '@colyseus/schema';
import { McwGameState, CoordSchema } from 'common';

import { BattleshipPlayerVariables, Shot, Ship, ShipType, Square, Alignment } from './types';

export class ShotSchema extends Schema implements Shot {
  @type(CoordSchema)
  coord = new CoordSchema().assign({ x: -1, y: -1 });

  @type('boolean')
  hit: boolean = false;
}

export class BattleshipPlayerVariablesSchema extends Schema /* implements BattleshipPlayerVariables */ {
  @type('boolean')
  hasPlacedShips: boolean = false;

  @type([ShotSchema])
  shots = new ArraySchema<ShotSchema>();
}

export class ShipSchema extends Schema implements Ship {
  @type('number')
  id: number = -1;

  @type('string')
  ownerId: string = '';

  @type('string')
  shipType: ShipType = ShipType.Battleship;

  @type(CoordSchema)
  coord = new CoordSchema().assign({ x: -1, y: -1 });

  @type('number')
  alignment: Alignment = Alignment.Horizontal;

  @type('boolean')
  sunk: boolean = false;
}

export class SquareSchema extends Schema implements Square {
  @type('string')
  ownerId: string = '';

  @type(CoordSchema)
  coord = new CoordSchema().assign({ x: -1, y: -1 });
}

export class GameState extends McwGameState {
  @type('string')
  nextTurn: string = '';

  // @type('string')
  // xPlayer: string = '';

  @type([ShipSchema])
  ships = new ArraySchema<ShipSchema>();

  @type([SquareSchema])
  squares = new ArraySchema<SquareSchema>();

  @type({ map: BattleshipPlayerVariablesSchema })
  playerVariables = new MapSchema<BattleshipPlayerVariablesSchema>();
}

export function setPlayerVariable(state: GameState, lobbyPlayerId: string, key: keyof BattleshipPlayerVariables, value: any) {
  state.playerVariables.get(lobbyPlayerId)[key] = value;
}
