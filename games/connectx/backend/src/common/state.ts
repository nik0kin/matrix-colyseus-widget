import { Schema, type, ArraySchema } from '@colyseus/schema';
import { McwGameState } from 'common';

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

export class CustomOptionsSchema extends Schema {
  @type('number')
  width: number = -1;

  @type('number')
  height: number = -1;

  @type('number')
  connectLength: number = -1;
}

export class GameState extends McwGameState {
  @type('string')
  nextTurn: string = '';

  @type('string')
  p1Player: string = '';

  @type([SpotSpace])
  spots = new ArraySchema<SpotSpace>();

  @type([TokenPiece])
  tokens = new ArraySchema<TokenPiece>();

  @type(CustomOptionsSchema)
  customOptions = new CustomOptionsSchema();
}
