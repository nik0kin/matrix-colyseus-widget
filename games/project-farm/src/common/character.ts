import { type, Schema, ArraySchema } from '@colyseus/schema';
import { CoordSchema } from 'common';


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
