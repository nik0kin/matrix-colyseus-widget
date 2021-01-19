import { type, ArraySchema, Schema, MapSchema } from '@colyseus/schema';
import { McwGameState } from 'common';
import { Coord } from 'utils';

import { CharacterSchema } from './character';
import { PlotSchema } from './map';

export class CustomOptionsSchema extends Schema {
  @type('number')
  width: number = -1;

  @type('number')
  height: number = -1;
}

export class GameState extends McwGameState {
  @type(CustomOptionsSchema)
  customOptions = new CustomOptionsSchema();

  @type([PlotSchema])
  map = new ArraySchema<PlotSchema>();

  @type([CharacterSchema])
  characters = new ArraySchema<CharacterSchema>();

  @type('number')
  karma: number = 0;

  @type('number')
  peopleFed: number = 0;

  @type({ map: 'number' })
  seedInventory = new MapSchema<number>();
}

export function getPlotAtLocation(gameState: GameState, coord: Coord) {
  return gameState.map.find((p) => p.coord.x === coord.x && p.coord.y === coord.y);
}
