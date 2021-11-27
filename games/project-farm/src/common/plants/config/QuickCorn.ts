import { PlantConfig } from '../plant-config';
import { MINUTE_IN_MS } from 'utils';

const QuickCorn: PlantConfig = {
  type: 'QuickCorn',
  growTime: 10 * MINUTE_IN_MS,
  harvestTime: 5 * MINUTE_IN_MS,
  cost: 2,
  requirement: {
    karma: 75,
  },
  feeds: 1.6,
  seedsOnHarvest: [1, 1],
};

export default QuickCorn;
