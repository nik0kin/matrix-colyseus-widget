import { ArraySchema, Schema, MapSchema, type } from '@colyseus/schema';
import { Coord } from 'utils';

import { Player } from './player';

export class PlayerSchema extends Schema implements Player {
  @type('string')
  id: string;

  @type('boolean')
  connected: boolean = true;

  @type('boolean')
  isAi: boolean = false;

  @type('string')
  color: string;
}

export enum GameStatus {
  PreGame = 1,
  InProgress = 2,
  Finished = 3,
}

export class CoordSchema extends Schema implements Coord {
  @type('number')
  x: number;

  @type('number')
  y: number;

  constructor(coord: Coord) {
    super();
    this.x = coord.x;
    this.y = coord.y;
  }
}

export class GameState extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();

  @type('number') // TODO enum?
  status: GameStatus = GameStatus.PreGame;

  @type([CoordSchema])
  roomsInBattle = new ArraySchema<CoordSchema>();
}
