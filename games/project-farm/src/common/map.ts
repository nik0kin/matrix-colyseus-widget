import { type, Schema } from '@colyseus/schema';
import { CoordSchema } from 'common';

export class PlotSchema extends Schema {
  @type(CoordSchema)
  coord = new CoordSchema();

  @type('string')
  dirt: 'Weeded' | 'Normal' | 'Plowed' = 'Normal';

  @type('number')
  actionTime: number = 0;

  // plant?: Plant;
}

