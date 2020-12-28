import { Schema, type, ArraySchema } from '@colyseus/schema';
import { GameStatus } from 'common';

export class SpotSpace extends Schema {
  @type('number')
  x: number = -1;

  @type('number')
  y: number = -1;

  @type('boolean')
  open: boolean = false;
}

export class TokenPiece extends Schema {
  @type('number')
  x: number = -1;

  @type('number')
  y: number = -1;

  @type('string')
  ownerId: string;
}

export class GameState extends Schema {
  @type('number') // TODO enum?
  status: GameStatus = GameStatus.PreGame;

  @type('string')
  winner: string = '';

  @type('string')
  nextTurn: string = '';

  @type('string')
  p1Player: string = '';

  @type([SpotSpace])
  spots = new ArraySchema<SpotSpace>();

  @type([TokenPiece])
  tokens = new ArraySchema<TokenPiece>();
}
