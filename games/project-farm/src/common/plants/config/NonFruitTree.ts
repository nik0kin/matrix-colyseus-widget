import { DAY_IN_MS } from 'utils';
import { PlantConfig } from '../plant-config';

const NonFruitTree: PlantConfig = {
  type: 'NonFruitTree',
  subtype: 'Tree',
  growTime: DAY_IN_MS,
  harvestTime: -1,
  cost: -1,
  feeds: 0,
  seedsOnHarvest: [0, 0],
};

export default NonFruitTree;
