import { PlantConfig } from '../plant-config';

const SeedlessWatermelon: PlantConfig = {
  type: 'SeedlessWatermelon',
  growTime: 4 * 60 * 60 * 1000,
  cost: 5,
  requirement: {
    karma: 150,
  },
  feeds: 11,
  seedsOnHarvest: [0, 0],
};

export default SeedlessWatermelon;
