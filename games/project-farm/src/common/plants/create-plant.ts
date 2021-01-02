import { Schema, type } from '@colyseus/schema';

type PlantType = 'Growing' | 'Harvestable' | 'Fruiting' | 'Withered';

export class PlantSchema extends Schema {
  @type('string')
  type: string = '';

  @type('string')
  stage: PlantType = 'Growing';

  @type('number')
  timeLeft: number = 0;

  // @type('number')
  // wateringTimeLeft: number = 0;
}
