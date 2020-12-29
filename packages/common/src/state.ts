import { Schema, MapSchema, type } from '@colyseus/schema';
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
}

export interface WithCustomOptions {
  customOptions: Schema;
}

export class McwGameState extends Schema {
  @type('number') // TODO enum?
  status: GameStatus = GameStatus.PreGame;

  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();

  @type('string')
  winner: string = '';
}
