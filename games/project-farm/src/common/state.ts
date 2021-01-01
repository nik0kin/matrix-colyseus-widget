import { type, ArraySchema } from '@colyseus/schema';
import { McwGameState } from 'common';

import { PlotSchema } from './map';

export class GameState extends McwGameState {
  @type([PlotSchema])
  map = new ArraySchema<PlotSchema>();
}
