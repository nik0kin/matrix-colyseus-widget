import { type, ArraySchema } from '@colyseus/schema';
import { McwGameState } from 'common';
import { Coord } from 'utils';

import { CharacterSchema } from './character';
import { PlotSchema } from './map';

export class GameState extends McwGameState {
  @type([PlotSchema])
  map = new ArraySchema<PlotSchema>();

  @type([CharacterSchema])
  characters = new ArraySchema<CharacterSchema>();
}

export function getPlotAtLocation(gameState: GameState, coord: Coord) {
  return gameState.map.find((p) => p.coord.x === coord.x && p.coord.y === coord.y);
}
