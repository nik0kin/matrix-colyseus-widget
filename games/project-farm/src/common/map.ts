import { type, Schema, ArraySchema } from '@colyseus/schema';
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
  plant = new ArraySchema<PlantSchema>();
}

export function getPlantFromPlot(plot: PlotSchema): PlantSchema | undefined {
  return plot.plant[0];
}

export function removePlantFromPlot(plot: PlotSchema) {
  if (plot.plant) {
    plot.plant.pop();
  }
}
