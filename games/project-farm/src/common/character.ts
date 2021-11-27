import { type, Schema, ArraySchema } from '@colyseus/schema';
import { CoordSchema } from 'common';

export const CHARACTER_SPEED = 1; // 1 plot per second

export enum ToolType {
  Hoe = 'Hoe',
  WateringCan = 'WateringCan',
  Shovel = 'Shovel',
  Axe = 'Axe',
}

export enum ActionType {
  Move = 'Move',
  Plow = 'Plow',
  Plant = 'Plant',
  Harvest = 'Harvest',
  Water = 'Water',
  ClearWithered = 'ClearWithered',
  Chop = 'Chop',
}

export class CharacterActionSchema extends Schema {
  @type('string')
  type: 'Move' | 'Plow' | 'Plant' | 'Harvest' | 'Water' | 'ClearWithered' =
    'Plow';

  @type(CoordSchema)
  coord = new CoordSchema();

  @type('string')
  plantToPlant?: string;
}

export class CharacterSchema extends Schema {
  @type(CoordSchema)
  coord = new CoordSchema();

  @type('string')
  tool: string = ToolType.Hoe; // PlantType or ToolType

  @type([CharacterActionSchema])
  actionQueue = new ArraySchema<CharacterActionSchema>();
}
