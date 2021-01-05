import { Schema, type } from '@colyseus/schema';

export enum PlantStageType {
  Growing = 'Growing',
  Harvestable = 'Harvestable',
  Fruiting = 'Fruiting',
  Withered = 'Withered',
}

export class PlantSchema extends Schema {
  @type('string')
  type: string = '';

  @type('string')
  stage: PlantStageType = PlantStageType.Growing;

  @type('number')
  timeLeft: number = 0; // TODO change to timeForTransform

  // @type('number')
  // wateringTimeLeft: number = 0;
}
