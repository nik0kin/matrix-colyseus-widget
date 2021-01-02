import { type, Schema, ArraySchema } from '@colyseus/schema';
import { CoordSchema } from 'common';

export const CHARACTER_SPEED = 1; // 1 plot per second

export enum ToolType {
  Hoe = 'Hoe',
  WateringCan = 'WateringCan',
  Shovel = 'Shovel',
}

export class CharacterActionSchema extends Schema {
  @type('string')
  type: 'Move' | 'Plow' | 'Plant' | 'Harvest' | 'Water' = 'Plow';

  @type(CoordSchema)
  coord = new CoordSchema();
}

export class CharacterSchema extends Schema {
  @type(CoordSchema)
  coord = new CoordSchema();

  @type('string')
  tool: string = ToolType.Hoe; // PlantType or ToolType

  @type([CharacterActionSchema])
  actionQueue = new ArraySchema<CharacterActionSchema>();
}
