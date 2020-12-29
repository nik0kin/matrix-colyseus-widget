import { type, ArraySchema } from '@colyseus/schema';
import { McwGameState } from 'common';

export class GameState extends McwGameState {
  @type('string')
  nextTurn: string = '';

  @type('string')
  xPlayer: string = '';

  @type(['string'])
  spots = new ArraySchema<string>();
}
