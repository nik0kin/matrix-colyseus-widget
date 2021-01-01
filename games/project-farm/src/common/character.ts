import { type, Schema, ArraySchema } from '@colyseus/schema';
import { CoordSchema } from 'common';

export const CHARACTER_SPEED = 1; // 1 plot per second

export class CharacterActionSchema extends Schema {
  @type('string')
  type: 'Plow' | 'Plant' | 'Harvest' | 'Water' = 'Plow';

  @type(CoordSchema)
  coord = new CoordSchema();
}

export class CharacterSchema extends Schema {
  @type(CoordSchema)
  coord = new CoordSchema();

  @type([CharacterActionSchema])
  actionQueue = new ArraySchema<CharacterActionSchema>();
}
