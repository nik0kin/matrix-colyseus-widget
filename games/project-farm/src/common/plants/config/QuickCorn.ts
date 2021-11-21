import { PlantConfig } from '../plant-config';

const QuickCorn: PlantConfig = {
  type: 'QuickCorn',
  growTime: 10 * 60 * 1000,
  harvestTime: 5 * 60 * 1000,
  cost: 2,
  requirement: {
    karma: 75,
  },
  feeds: 1,
  seedsOnHarvest: [1, 1],
};

export default QuickCorn;
