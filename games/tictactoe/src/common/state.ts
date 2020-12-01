import { Schema, type, ArraySchema } from '@colyseus/schema';
import { GameStatus } from 'common';

export class GameState extends Schema {
  @type('number') // TODO enum?
  status: GameStatus = GameStatus.PreGame;

  @type('string')
  winner: string = '';

  @type('string')
  nextTurn: string = '';

  @type('string')
  xPlayer: string = '';

  @type(['string'])
  spots = new ArraySchema<string>();
}
