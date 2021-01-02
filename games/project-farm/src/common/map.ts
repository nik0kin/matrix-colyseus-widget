import { type, Schema } from '@colyseus/schema';
import { CoordSchema } from 'common';
import { PlantSchema } from './plants';

export class PlotSchema extends Schema {
  @type(CoordSchema)
  coord = new CoordSchema();

  @type('string')
  dirt: 'Weeded' | 'Normal' | 'Plowed' = 'Normal';

  @type('number')
  actionTime: number = 0;

  @type([PlantSchema])
  plant?: PlantSchema;
}

